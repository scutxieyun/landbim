function LandOnMap(div){
	var othis = this;
	this.div = div;
	this.drawTable = drawTable;
	this.focusPloygon = null;
	function drawTable(lands){
		$(othis.div + " table").empty();
		othis.lands = lands;
		$.each(lands,function(index,item){
			var marker = new BMap.Marker(new BMap.Point(item.refLatitude, item.refLongitude));
			map.addOverlay(marker);
			marker.addEventListener("click",function(evt){
				focusOnLand(othis.lands[index]);
			});
			$("<tr id=" + index + "></tr>").append("<td>" + item.refLatitude.toString() + "." + item.refLongitude.toString() + "</td>")
						 .append("<td>" + item.title + "</td>")
						 .appendTo($(othis.div + " table"));
		});
		$(othis.div + " table tr").click(function(evt){
			var item = othis.lands[evt.target.parentElement.id];
			focusOnLand(item);
			evt.preventDefault();
		});
	}
	function focusOnLand(item){
		var refPoint = new BMap.Point(item.refLatitude,item.refLongitude);
		var proj = map.getMapType().getProjection()
		var refMct = proj.lngLatToPoint(refPoint);
		var ploygon = $.map(item.boundary,function(point,index){
			return proj.pointToLngLat(new BMap.Pixel(point.x + refMct.x,point.y + refMct.y));
		});
		var boundary = new BMap.Polygon(ploygon);
		map.centerAndZoom(new BMap.Point(item.refLatitude,item.refLongitude),16);
		if(othis.focusPloygon != null){
			map.removeOverlay(othis.focusPloygon);
		}
		othis.focusPloygon = boundary;
		map.addOverlay(boundary);
	}
}
