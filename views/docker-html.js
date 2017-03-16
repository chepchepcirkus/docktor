var DockerHtml = function(app) {
	this.app = app;
};
DockerHtml.prototype.renderHtml = function (method, data){
    if(data == null) {
        return '<div class="cont">Invalid data</div>';
    }
    if(data.length == 0) {
        return '<div class="cont">Empty data</div>';
    }
    var html = '';
    if(this[method] != undefined && typeof(this[method]) == 'function') {
        html = this[method](data);
    } else {
    	html = 'method not found';
    }
    return html;
};
// Containers 
DockerHtml.prototype.renderContainersList = function (data){
    var data = this.sort(data);
    /**
     * + more icon on the left side , on click see id
     *
     */
    var html = '<div class="cont table">';
    html += '<div class="w-10">';
    html += '<div class="w-4 a-center">Name</div>';
    html += '<div class="w-3 a-center">Status</div>';
    html += '<div class="w-3 a-center">Ip</div>';
    html += '</div>';
    for(var i in data) {
        var ip = '';
		if(data[i].NetworkSettings.Networks[data[i]['HostConfig']['NetworkMode']] != undefined) {
    		ip = data[i].NetworkSettings.Networks[data[i]['HostConfig']['NetworkMode']]['IPAMConfig']['IPv4Address']
		}
		var bgState = 'bg-grey-light';
		if(data[i].State == 'running') {
            bgState = 'bg-greenthea-light';
        }
    	html += '<div class="w-10 ' + bgState + '" id="' + i + '">'
    	        + '<div class="w-10">'
                // + this.renderObjectToStr(data[i], 'list')
				+ '<div class="w-4">'
                + i + ' -- ' + data[i].Names[0]
                + '</div>'
				+ '<div class="w-3">'
                + data[i].Status
                + '</div>'
				+ '<div class="w-3">'
                + ip
                + '</div>'
                + '</div>'
                + '<div class="w-10">'
    			+ '<div class="w-1 a-center">'
    			+ '<a class="button" href="/containers/start/' + data[i]['Id'] + '"><i class="fa fa-play"></i></a>'
				+ '</div>'
				+ '<div class="w-1 a-center">'
    			+ '<a class="button" href="/containers/stop/' + data[i]['Id'] + '"><i class="fa fa-stop"></i></a>'
    			+ '</div>'
    			+ '<div class="w-1 a-center">'
    			+ '<a class="button" href="/containers/remove/' + data[i]['Id'] + '"><i class="fa fa-close"></i></a>'
    			+ '</div>'
    			+ '<div class="w-1 a-center">'
    			+ '<a class="button" href="/containers/view/' + data[i]['Id'] + '"><i class="fa fa-bar-chart"></i></a>'
    			+ '</div>'
    			+ '</div>'
    			+ '</div>';
    }
    html += '</div>';
    return html;
};
DockerHtml.prototype.renderContainerView = function(data){
	return '<div class="cont">'
	        + '<div class="w-10 controls">'
            + '<div class="w-1 a-center">'
            + '<a class="button" href="/containers/start/' + data.inspect['Id'] + '"><i class="fa fa-play"></i></a>'
            + '</div>'
            + '<div class="w-1 a-center">'
            + '<a class="button" href="/containers/stop/' + data.inspect['Id'] + '"><i class="fa fa-stop"></i></a>'
            + '</div>'
            + '</div>'
            + '<div class="w-10">'
            + '<h3>Informations</h3>'
			+ this.renderObjectToStr(data.inspect, 'list')
			+ '</div>'
			+ '<div class="w-5">'
            + '<h3>Logs</h3>'
	 		+ data.log
	 		+ '</div>'
			+ '<div class="w-5">'
            + '<h3>State</h3>'
			+ this.renderObjectToStr(data.state)
			+ '</div>'
			+ '</div>';
};
// Images
DockerHtml.prototype.renderImagesList = function (data){
    var data = this.sort(data);
    /**
     * data[i].Repotags[0]
     * this .renderObjectToStr(data[i].Labels, 'list')
     * data[i].Size
     */
    var html = '<div class="cont table">';

    for(var i in data) {
        var repoTag = data[i].RepoTags[0];
    	html += '<div class"w-10" id="' + i + '">'
                + '<div class="w-9">'
    			+ this .renderObjectToStr(data[i], 'list')
    			+ '</div>'
    			+ '<div class="w-1">'
    			+ '<a class="btn icon" href="/images/view/' + data[i]['Id'] + '"><i class="fa fa-bar-chart"></i></a>'
    			+ '</div></div>';
    }
    html += '</div>';
    return html;
};
DockerHtml.prototype.renderImageView = function(data){
	return '<div class="cont">'
	        + '<div class="w-5">'
            + '<h3>Informations</h3>'
			+ this.renderObjectToStr(data.inspect, 'list')
			+ '</div>'
			+ '<div class="w-5"><h3>History</h3>'
	 		+ this.renderObjectToStr(data.history, 'list')
			+ '</div>'
			+ '</div>';
};
// Networks
DockerHtml.prototype.renderNetworksList = function (data){
    var data = this.sort(data);
    var html = '<div class="cont table">';
    for(var i in data) {
    	html += '<div class"w-10" id="' + i + '">'
                + '<div class="w-9">'
    			+ this .renderObjectToStr(data[i], 'list')
    			+ '</div>'
    			+ '<div class="w-1">'
    			+ '<a class="btn icon" href="/networks/view/' + data[i]['Id'] + '"><i class="fa fa-bar-chart"></i></a>'
    			+ '</div>'
                + '</div>';
    }
    html += '</div>';
    return html;
};
DockerHtml.prototype.renderNetworkView = function(data){
	return '<div class="cont">'
	        + '<div class="w-10">'
            + '<h3>Informations</h3>'
			+ this.renderObjectToStr(data, 'list')
			+ '</div>'
			+ '</div>';
};
// functions
DockerHtml.prototype.renderObjectToStr= function (data, customClass){
    var varClass = '';
    if(customClass != undefined) {
        var varClass = 'class="' + customClass + '"';
    }
    var html = '<ul ' + varClass + '>';
    for(var i in data) {
    	if(typeof data[i] == 'object') {
    		html += '<li><span>' + i + ' : </span>' + '<span>' + this.renderObjectToStr(data[i]) + '</span></li>';
    	} else {
    		html += '<li><span>' + i + ' : </span>' + '<span>' + data[i] + '</span></li>';
    	}
    }
    html += '</ul>';
    return html;
};
DockerHtml.prototype.sort= function (data){
    var sortedData = [];
    for(var i in data) {
        if(typeof data[i] == 'object' && data[i].Id != undefined) {
            sortedData[data[i].Id.substring(0,11)] = data[i];
        }
    }
    return sortedData;
};
module.exports = DockerHtml;