FROM 172.31.0.157/tool/nginx
RUN rm -rf /usr/share/nginx/html/*
ADD dist /usr/share/nginx/html/