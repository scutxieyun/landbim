function XBimView(cfg){
	var othis = this;
	
	XBimView.ak = cfg.ak;
	this.bimServerApi = null;
	this.url = "/bimserver";
	this.login = login_bimserver;
	this.projects = null;
	this.project_keys = null;
	this.update_loc_index = -1;
	function login_bimserver(param,cb){
		othis.bimServerApi = new BimServerApi(param.server);
		othis.bimServerApi.login(param.user_name, param.password,true, function(){
				return cb(true);
			}, function() {
				return cb(false);
			});
	}
}
XBimView.prototype.loadAPI = function(){
	if($.cookie("autologin") == null) return;
	$.getScript($.cookie("address") + "/js/bimserverapi.js").done(function(script, textStatus) {
					window.clearTimeout(timeoutId);
					othis.bimServerApi = new BimServerApi($.cookie("address"));
					othis.bimServerApi.token = $.cookie("autologin");
					othis.bimserverImportDialogShowTab2();
					othis.bimserverImportDialogRefresh();
	});
};


XBimView.prototype.updateLocationInfo = function(cb){
	if(this.update_loc_index >= 0) return;
	this.update_loc_index = 0;
	this.update_cb = cb;
	pid = this.project_keys[this.update_loc_index]
	BAE_Get_Address();
}
function CordinateConv(ifcCord){
	var res = 0;
	var factor = 1;
	if(ifcCord instanceof Array){
		for(i = 0;i < ifcCord.length - 1;i ++){
			res = res + (ifcCord[i] / factor);
			factor = factor * 60;
		}
	}
	return res;
}
function renderReverse(data){
	var pid = xbim_views.project_keys[xbim_views.update_loc_index];
	xbim_views.update_cb(pid,data.result.formatted_address);
	xbim_views.update_loc_index ++;
	if(xbim_views.update_loc_index < xbim_views.project_keys.length)
		BAE_Get_Address();
	else{
		xbim_views.update_loc_index = - 1;
	}
}
function BAE_Get_Address(){
	var pid = xbim_views.project_keys[xbim_views.update_loc_index];
	var refLatitude = xbim_views.projects[pid].refLatitude;
	var refLongtitude = xbim_views.projects[pid].refLongtitude;
	$.ajax({
		url:"http://api.map.baidu.com/geocoder/v2/?ak=" + 
				XBimView.ak + "&callback=renderReverse&location=" + 
				refLatitude + "," + refLongtitude + "&output=json&pois=0",
		dataType:"jsonp",
		jsonp:"renderReverse",
	});
	//$.getJSON("http://api.map.baidu.com/geocoder?&callback=renderReverse&location=" + refLatitude + "," + refLongtitude
	//		+ "&output=json&key=FQeNAsFsrNQShqMdXNrD45j5")
//	$.getJSON("http://api.map.baidu.com/geocoder/v2/?ak=" + 
//				XBimView.ak + "&callback=renderReverse&location=" + 
//				refLatitude + "," + refLongtitude + "&output=json&pois=0")
	//	.done(function(data){
	//			callback(data);
	//		});
	return;
}
XBimView.prototype.load_projects = function(cb){
	//if($.cookie("autologin") == null) return;
	var othis = this;
	this.bimServerApi.call("Bimsie1ServiceInterface", "getAllProjects", {
			onlyTopLevel : true,
			onlyActive: true
		}, function(data) {
			var req_prjs = "";
			othis.projects = new Object();
			othis.project_keys = new Array();
			data.forEach(function(project) {
				othis.projects[project.id] = project;
				othis.project_keys.push(project.id);
				req_prjs = req_prjs + project.id + ",";
			});
			$.getJSON("/examples/BimRequest?action=get_prj&prjs=" + req_prjs).done(function(prjs) {
					prjs.forEach(function (item){
					othis.projects[item.id].refLatitude = CordinateConv(item.refLatitude);
					othis.projects[item.id].refLongtitude = CordinateConv(item.refLongtitude);
				});
				return cb(othis.projects);
					}).fail(function() {
					console.log( "error" );
					})
					.always(function() {
					console.log( "complete" );
					});
		}, function() {
			return cb(false);
		});
}
