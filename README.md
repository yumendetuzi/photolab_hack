# photolab_hack  

<img src="https://github.com/gasparian/photolab_hack/blob/master/imgs/photolab_hack_emb.jpg" height=500>  

## UI  
<img src="https://github.com/gasparian/photolab_hack/blob/master/imgs/onboarding_1.jpg" height=500> <img src="https://github.com/gasparian/photolab_hack/blob/master/imgs/inputs.jpg" height=500>  
<img src="https://github.com/gasparian/photolab_hack/blob/master/imgs/pre_mix.jpg" height=500> <img src="https://github.com/gasparian/photolab_hack/blob/master/imgs/mixed.jpg" height=500>  

## Deploying    
1. Install docker.
2. Pull last image version to your machine from [dockerhub](https://cloud.docker.com/repository/docker/gasparjan/photolab_hack/general):
 ```
 docker pull gasparjan/photolab_hack:latest
 ```
3. Configure access to AWS S3 on the host machine:
 - go to .aws folder:
 ```
 cd ~/.aws
 ```
 - create config file and fill it with user name:
 ```
 [profile %USER_NAME%]
 ```
 - create credentials file and fill it with secret keys:
 ```
 [%USER_NAME%]
 
 aws_access_key_id = AAAAAAAAAAAAAAAAAAA
 aws_secret_access_key = RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
 ```
4. Run docker:
 ```
 docker run --rm -it -v /tmp:/tmp -v /root/.aws:/root/.aws -p 8080:8000 --ipc=host gasparjan/photolab_hack:latest
 ```
 or go to project folder and run bash script:
 ```
 cd ~/photolab_hack
 ./run_docker.sh
 ```
5. Run server:
 ```
 gunicorn --bind=0.0.0.0:8000 \
          --workers=10 \
          -k gthread \
          --thread=2 \
          --timeout 30 \
          --graceful-timeout 30 \
          --chdir /root/photolab_hack app:app \
          --preload \
          --max-requests 10 \
          --capture-output \
          --error-logfile /tmp/gene-log.txt
 ```
 or go to the project folder and run bash script:
 ```
 cd ~/photolab_hack
 ./start.sh
 ```
 
