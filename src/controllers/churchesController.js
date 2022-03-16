const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const { id } = request.params;

        const churches = await connection('churches')
            .innerJoin('users', 'churches.user_id', 'users.id')
            .innerJoin('informations', 'users.id', 'informations.user_id')
            .innerJoin('adresses', 'users.id', 'adresses.user_id')
            .innerJoin('functions', 'users.id', 'functions.user_id')
            .innerJoin('images', 'users.id', 'images.user_id')
            .innerJoin('nascimento', 'users.id', 'nascimento.user_id')
            .innerJoin('batismo', 'users.id', 'batismo.user_id')
            .where({
                'churches.congregacao': id,
                'users.status': true
            })
            .select(
                'users.*',
                'images.key',
                'images.size',
                'images.created_at',
                'images.url',
                'adresses.*',
                'churches.*',
                'informations.*',
                'functions.*',
                'nascimento.*',
                'batismo.*',
            )
            .orderBy('users.nome', 'asc')

            return response.json(churches);
    },

    async getCount(request, response){
        const count = await connection('churches')
        .distinct('congregacao')


        return response.json(count)
    },
}