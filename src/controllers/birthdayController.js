const connection = require('../database/connection')

module.exports = {
    async index(request, response) {
        const { mes } = request.params;

        const user = await connection('nascimento')
            .innerJoin('users', 'nascimento.user_id', 'users.id')
            .innerJoin('informations', 'users.id', 'informations.user_id')
            .innerJoin('adresses', 'users.id', 'adresses.user_id')
            .innerJoin('functions', 'users.id', 'functions.user_id')
            .innerJoin('churches', 'users.id', 'churches.user_id')
            .innerJoin('batismo', 'users.id', 'batismo.user_id')
            .innerJoin('images', 'users.id', 'images.user_id')
            .where({
                'mes_nascimento': mes,
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
            .orderBy('dia_nascimento', 'users.name', 'asc')

        return response.json(user);
    }
}