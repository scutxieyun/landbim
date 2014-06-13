<%@page contentType="text/html; charset=UTF-8" %>
<% if (session.getAttribute("nickname") == null) {
    response.sendRedirect("login.jsp");
    return;
}
%>