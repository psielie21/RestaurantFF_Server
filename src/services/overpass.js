import overpass from "query-overpass";

export default function(currLon, currLat, cb){
    let delta = 0.002
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
        if (err) throw err;
        let difference = Date.now() - now;
        console.log("Time taken for querying restaurants: " + difference)
        cb(err, convertOpenMaps(data["features"]))
        
    })
}

function queryBox(coords, cb){
    let lat1, lon1, lat2, lon2; 
    try {
         ({ lat1, lon1, lat2, lon2 } = coords);
    }catch (e){
        throw new Error("Coords not valid!");
        return;
    }
    
    const GET_NEARBY_RESTAURANTS = `(
      node(${lat1}, ${lon1}, ${lat2}, ${lon2})["amenity" = "cafe"];
      node(${lat1}, ${lon1}, ${lat2}, ${lon2})["amenity" = "restaurant"];
      node(${lat1}, ${lon1}, ${lat2}, ${lon2})["amenity" = "bar"];
    );
    out body;
    >;
    out skel qt;`
    //console.log(GET_NEARBY_RESTAURANTS);

    let now = Date.now();
    overpass(GET_NEARBY_RESTAURANTS, function(err, data){
        if (err){
            console.log(err.message);
            cb(err, null);
        }
        
        let difference = Date.now() - now;
        console.log(difference)
        try {
            const feat = data["features"]
            cb(err, convertOpenMaps(data["features"]))
        } catch (e){
             cb(e, null)
        }
       
        
    })
}

export { queryBox }



function convertOpenMaps(features){
    let returnArr = [];
    for(let i = 0; i < features.length; i++){
        let lon = features[i].geometry.coordinates[1];
        let lat = features[i].geometry.coordinates[0];
        
        //hackish hack for when the name of the restaurant is undefined
        if(!features[i].properties.tags.name){
            features[i].properties.tags.name = "Undefined Name";
        }
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