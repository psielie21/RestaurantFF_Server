import Restaurant from "../../models/Restaurant";

export default {
    addRestaurant: async (_, {...rest}, {user}) => {
        try {
            const r = await Restaurant.create({...rest})
            return r;
        } catch (err){
            throw err
        }
    }
}