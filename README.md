## MedCheck

## Deployment
MedCheck is deployed using [Docker](http://docker.com), with the docker image available publicly on [Docker Hub](https://registry.hub.docker.com/u/octoconsulting/18f-ads/). In order to deploy the application in your own Docker environment, the following steps are required:

### Download the container

	docker pull docker pull octoconsulting/18f-ads

### Start the container
	docker run -d -p 80:3000 -t docker pull octoconsulting/18f-ads

This will start the container listening on port 80, you can specify a different port by changing the command above. Also, this port will have to be open and accessible on your server.

### Get the container ID with docker ps
	# docker ps
	CONTAINER ID          IMAGE                      ...
	[container_id]        octoconsulting/18f-ads     ...

### Tell the container to fetch and build the application
	docker exec [container_id] /usr/local/bin/buildMedCheck.sh

### ... That's it!
Once the build is complete you can access the application on the port you specified above.
