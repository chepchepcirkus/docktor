var DockerHtml = function() {};
DockerHtml.prototype.renderHtml = function (data){
    if(data['containers-list'] != undefined) {
        return this.renderContainerList(data['containers-list'])
    }
    return 'method not found';
}
DockerHtml.prototype.renderContainerList = function (data){
    var html = '<div class="list-head">';
    html += '<div>Command</div>';
    html += '<div>Created</div>';
    html += '<div>HostConfig</div>';
    html += '<div>Id</div>';
    html += '<div>ImageID</div>';
    html += '<div>Labels</div>';
    html += '<div>Mounts</div>';
    html += '<div>Names</div>';
    html += '<div>NetworkSettings</div>';
    html += '<div>Ports</div>';
    html += '<div>State</div>';
    html += '<div>Status</div>';
    html += '</div>';
    html += '<div class="list">';
    for(var i in data) {
        html += '<div>' + data[i].Command + '</div>';
        html += '<div>' + data[i].Created + '</div>';
        // html += '<div>' + data[i].HostConfig + '</div>';
        html += '<div>' + data[i].Id + '</div>';
        html += '<div>' + data[i].ImageID + '</div>';
        // html += '<div>' + data[i].Labels + '</div>';
        // html += '<div>' + data[i].Mounts< + '</div>';
        html += '<div>' + data[i].Names + '</div>';
        // html += '<div>' + data[i].NetworkSettings + '</div>';
        html += '<div>' + data[i].Ports + '</div>';
        html += '<div>' + data[i].State + '</div>';
        html += '<div>' + data[i].Status + '</div>';
    }
    html += '</div>'
    return html
}
module.exports = DockerHtml;