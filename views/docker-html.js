var DockerHtml = function(app) {
	this.app = app;
};
DockerHtml.prototype.renderHtml = function (method, data){
    if(data == null) {
        return '<div class="cont">Invalid data</div>';
    }
    var html = '';
    if(this[method] != undefined && typeof(this[method]) == 'function') {
        html = this[method](data);
    } else {
    	html = 'method not found';
    }
    return '<div class="cont">' + html + '</div>';
};
// Containers 
DockerHtml.prototype.renderContainersList = function (data){
    var html = '';
    for(var i in data) {
    	html += '<div class="w-10">'
                + '<div class="w-8">'
    			+ this.renderObjectToStr(data[i], 'list')
    			+ '</div>'
    			+ '<div class="w-1">'
    			+ '<a class="btn icon" href="/containers/start/' + data[i]['Id'] + '"><i class="fa fa-play"></i></a>'
    			+ '<a class="btn icon" href="/containers/stop/' + data[i]['Id'] + '"><i class="fa fa-stop"></i></a>'
    			+ '</div>'
    			+ '<div class="w-1">'
    			+ '<a class="btn icon" href="/containers/view/' + data[i]['Id'] + '"><i class="fa fa-bar-chart"></i></a>'
    			+ '</div>'
    			+ '</div>';
    }
    return html;
};
DockerHtml.prototype.renderContainerView = function(data){
	return '<div class="w-10"><h3>Informations</h3>'
			+ this.renderObjectToStr(data.inspect, 'list')
			+ '</div>'
			+ '<div class="w-5"><h3>Logs</h3>'
	 		+ this.renderObjectToStr(data.log)
	 		+ '</div>'
			+ '<div class="w-5"><h3>State</h3>'
			+ this.renderObjectToStr(data.state)
			+ '</div>';
};
// Images
DockerHtml.prototype.renderImagesList = function (data){
    var html = '';
    for(var i in data) {
    	html += '<div class"w-10"><div class="w-9">'
    			+ this .renderObjectToStr(data[i], 'list')
    			+ '</div>'
    			+ '<div class="w-1">'
    			+ '<a class="btn icon" href="/images/view/' + data[i]['Id'] + '"><i class="fa fa-bar-chart"></i></a>'
    			+ '</div></div>';
    }
    return html + '</div>';
};
DockerHtml.prototype.renderImageView = function(data){
	return '<div class="w-5"><h3>Informations</h3>'
			+ this.renderObjectToStr(data.inspect, 'list')
			+ '</div>'
			+ '<div class="w-5"><h3>History</h3>'
	 		+ this.renderObjectToStr(data.history, 'list')
			+ '</div>';
};
// Networks
DockerHtml.prototype.renderNetworksList = function (data){
    var html = '';
    for(var i in data) {
    	html += '<div class"w-10"><div class="w-9">'
    			+ this .renderObjectToStr(data[i], 'list')
    			+ '</div>'
    			+ '<div class="w-1">'
    			+ '<a class="btn icon" href="/networks/view/' + data[i]['Id'] + '"><i class="fa fa-bar-chart"></i></a>'
    			+ '</div></div>';
    }
    return html;
};
DockerHtml.prototype.renderNetworkView = function(data){
	return '<div class="w-10"><h3>Informations</h3>'
			+ this.renderObjectToStr(data, 'list')
			+ '</div>';
};
// functions
DockerHtml.prototype.renderObjectToStr= function (data, customClass){
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
module.exports = DockerHtml;