const connection = require('../database/connection')

module.exports = {
    async getCount(request, response) {
        const count = await connection('adresses')
            .distinct('cidade')


        return response.json(count)
    },
}


