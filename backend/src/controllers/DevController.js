const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {

    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, longitude, latitude } = request.body;

        let dev = await Dev.findOne({ github_username })

        if (!dev) {

            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)

            const { name = login, avatar_url, bio } = apiResponse.data;

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })
        }

        return response.json(dev);
    },

    async update(request, response) {
        const id = request.params.id;
        const newAttributes = request.body;

        const dev = await Dev.findOneAndUpdate(
            { id },
            { $set: newAttributes }
        )

        const message = dev ? dev : "Dev not found";

        return response.json({ message: dev });
    },

    async destroy(request, response) {
        const dev = await Dev.findByIdAndDelete(request.params.id)
        const message = dev ? "Delete successfull" : "Dev not found"
        return response.json({ message: message })
    }
}