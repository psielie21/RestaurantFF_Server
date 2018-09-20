import overpass from "query-overpass";

export default function(currLon, currLat, cb){
    let delta = 0.005
    let lat1 = currLat - delta;   
    let lon1 = currLon - delta;
    let lat2 = currLat + delta;
    let lon2 = currLon + delta;
    
    const GET_NEARBY_RESTAURANTS = `(
      node(${lat1}, ${lon1}, ${lat2}, ${lon2})["amenity" = "cafe"];
      node(${lat1}, ${lon1}, ${lat2}, ${lon2})["amenity" = "restaurant"];
      node(${lat1}, ${lon1}, ${lat2}, ${lon2})["amenity" = "bar"];
    );
    out body;
    >;
    out skel qt;`
    
    
    let now = Date.now();
    overpass(GET_NEARBY_RESTAURANTS, function(err, data){
        let difference = Date.now() - now;
        console.log(difference)
        cb(err, convertOpenMaps(data["features"]))
        
    })
}



function convertOpenMaps(features){
    let returnArr = [];
    for(let i = 0; i < features.length; i++){
        let lon = features[i].geometry.coordinates[0];
        let lat = features[i].geometry.coordinates[1];
        returnArr[i] = { 
            name : features[i].properties.tags.name,
            location: {
                coordinates: [
                    lat,
                    lon
                ],
                type: "Point"
                
            },
            _id: features[i].properties.id,
            recommendations: null,
        }
    }
    return returnArr;
}