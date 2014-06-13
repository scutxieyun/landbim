import java.io.*;
import java.util.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
public class BimRequest extends HttpServlet{
	@Override
    public void doGet(HttpServletRequest request,
                      HttpServletResponse response)
        throws IOException, ServletException
    {
		PrintWriter out = response.getWriter();
		response.setContentType("application/json");		
		if(request.getQueryString() == null) out.println("no params");
		else{
			HashMap<String,String> map = new HashMap<String,String>();
			String[] pairs = request.getQueryString().split("&");
			for(int i = 0;i < pairs.length;i ++){
				String KV[] = pairs[i].split("=");
				if(KV.length == 2){
					map.put(KV[0],KV[1]);
				}
			}
			doAction(map,out);
		}
	}
	void doAction(HashMap<String,String> map,PrintWriter out){
		if(map.get("action") != null){
			if(map.get("action").compareTo("get_prj") == 0){
				if(map.get("prjs") == null) return;
				/*out.println("[{\"id\":3,\"refLatitude\":[39,54,57,601318],\"refLongtitude\":[116,25,58,795166]}," + 
							"{\"id\":2,\"refLatitude\":[39,54,57,601318],\"refLongtitude\":[116,25,58,795166]}]");
				*/
				out.println("[\n");
				String prjs[] = map.get("prjs").split(",");
				boolean first = true;
				for(int i = 0;i < prjs.length; i++){
					try{
						if(!first) out.println(",");
						first = false;
						BufferedReader br = new BufferedReader(new FileReader(System.getProperty("catalina.base") + 
																				"\\webapps\\examples\\xdb\\" + 
																				prjs[i] + ".json"));
						String ln = br.readLine();
						while(ln != null){
							out.println(ln);
							ln = br.readLine();
						}
						br.close();
					}catch(IOException e){
						//br.close();
					}
					finally{
						continue;
					}
				}
				out.println("]");
			}else{
			
			}
		}
	}
}