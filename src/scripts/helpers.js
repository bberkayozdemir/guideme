const helpers = {
    distance: function(lat1, lon1, lat2, lon2, unit) {

        lat1 = parseFloat(lat1)
        lon1 = parseFloat(lon1)
        lat2 = parseFloat(lat2)
        lon2 = parseFloat(lon2)

        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") {
                dist = dist * 1.609344
            }
            if (unit=="M") {
                dist = dist * 1.609344 * 1000
            }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
        }
    },

    today : () => {
        var today = new Date();
        var year = today.getFullYear()
        var month = today.getMonth()+1
        var day = today.getDate()

        if (month.toString().length == 1)
            month = "0"+month

        return year + "-"+ month + "-" +day
    }
}

export default helpers