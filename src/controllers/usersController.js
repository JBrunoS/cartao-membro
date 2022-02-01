const connection = require('../database/connection');
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

module.exports = {

    async index(request, response) {

        const users = await connection('users')
            .innerJoin('informations', 'users.id', 'informations.user_id')
            .innerJoin('adresses', 'users.id', 'adresses.user_id')
            .innerJoin('churches', 'users.id', 'churches.user_id')
            .innerJoin('functions', 'users.id', 'functions.user_id')
            .innerJoin('nascimento', 'users.id', 'nascimento.user_id')
            .innerJoin('batismo', 'users.id', 'batismo.user_id')
            .innerJoin('images', 'users.id', 'images.user_id')
            .select(
                'users.*',
                'images.key',
                'images.size',
                'images.created_at',
                'adresses.*',
                'churches.*',
                'informations.*',
                'functions.*',
                'nascimento.*',
                'batismo.*',
            )
            .orderBy('users.nome', 'asc')

        return response.json(users);
    },

    async getCount(request, response) {
        const count = await connection('users')
            .count('cpf')


        return response.json(count)
    },

    async selectSpecificUser(request, response) {
        const { cpf } = request.params;

        const userId = await connection('users')
            .where({ 'cpf': cpf })
            .select('id')
            .first();

        response.json(userId);
    },

    async selectUserById(request, response) {
        const { id } = request.params;

        const user = await connection('users')
            .innerJoin('informations', 'users.id', 'informations.user_id')
            .innerJoin('adresses', 'users.id', 'adresses.user_id')
            .innerJoin('churches', 'users.id', 'churches.user_id')
            .innerJoin('functions', 'users.id', 'functions.user_id')
            .innerJoin('nascimento', 'users.id', 'nascimento.user_id')
            .innerJoin('batismo', 'users.id', 'batismo.user_id')
            .innerJoin('images', 'users.id', 'images.user_id')
            .where({ 'users.id': id })
            .select(
                'users.*',
                'images.key',
                'images.size',
                'images.created_at',
                'adresses.*',
                'churches.*',
                'informations.*',
                'functions.*',
                'nascimento.*',
                'batismo.*'

            )
            .first();

        return response.json(user);
    },


    async create(request, response) {
        const {
            nome,
            estado_civil,
            cpf,
            rg,
            sexo,
            filiacao,
            telefone,
            email,
            endereco,
            numero,
            bairro,
            cidade,
            uf,
            congregacao,
            funcao,
            data_batismo,
            data_nascimento,

        } = request.body;

        const dia_nascimento = data_nascimento.slice(8)
        const mes_nascimento = data_nascimento.slice(5, 7)
        const ano_nascimento = data_nascimento.slice(0, 4)

        const dia_batismo = data_batismo.slice(8)
        const mes_batismo = data_batismo.slice(5, 7)
        const ano_batismo = data_batismo.slice(0, 4)

        const user = await connection('users')
            .where({ 'cpf': cpf })
            .orWhere({ 'rg': rg })
            .select('*')
            .first();

        if (!user) {

            await connection('users')

                .insert({
                    nome,
                    estado_civil,
                    cpf,
                    rg,
                    sexo,
                    filiacao
                })

            const userId = await connection('users')
                .where({ 'cpf': cpf })
                .select('id')
                .first();


            await connection('informations')
                .insert({
                    telefone,
                    email,
                    user_id: userId.id
                })

            await connection('adresses')
                .insert({
                    endereco,
                    numero,
                    bairro,
                    cidade,
                    uf,
                    user_id: userId.id
                })

            await connection('churches')
                .insert({
                    congregacao,
                    user_id: userId.id
                })

            await connection('functions')
                .insert({
                    funcao,
                    user_id: userId.id
                })

            await connection('nascimento')
                .insert({
                    dia_nascimento,
                    mes_nascimento,
                    ano_nascimento,
                    user_id: userId.id
                })

            await connection('batismo')
                .insert({
                    dia_batismo,
                    mes_batismo,
                    ano_batismo,
                    user_id: userId.id
                })

            return response.status(204).send();
        }

        return response.status(200).send();

    },

    async createImage(request, response) {
        const { id } = request.params;

        await connection('images')
            .insert({
                nome: request.file.originalname,
                key: request.file.filename,
                size: request.file.size,
                user_id: id
            })

        return response.json(200).send();
    },

    async getUserAll(request, response) {
        const { cpf } = request.params;

        const user = await connection('users')
            .innerJoin('informations', 'users.id', 'informations.user_id')
            .innerJoin('adresses', 'users.id', 'adresses.user_id')
            .innerJoin('churches', 'users.id', 'churches.user_id')
            .innerJoin('functions', 'users.id', 'functions.user_id')
            .innerJoin('nascimento', 'users.id', 'nascimento.user_id')
            .innerJoin('batismo', 'users.id', 'batismo.user_id')
            .innerJoin('images', 'users.id', 'images.user_id')
            .where({ 'cpf': cpf })
            .select(
                'users.*',
                'images.key',
                'images.size',
                'images.created_at',
                'adresses.*',
                'churches.*',
                'informations.*',
                'functions.*',
                'nascimento.*',
                'batismo.*',
            )

        return response.json(user);
    },

    async deleteUser(request, response) {
        const { id, key } = request.params;


        await connection('informations')
            .where({ 'user_id': id })
            .delete();

        await connection('adresses')
            .where({ 'user_id': id })
            .delete();

        await connection('churches')
            .where({ 'user_id': id })
            .delete();

        await connection('functions')
            .where({ 'user_id': id })
            .delete();

        await connection('images')
            .where({ 'user_id': id })
            .delete();

        await connection('nascimento')
            .where({ 'user_id': id })
            .delete();

        await connection('batismo')
            .where({ 'user_id': id })
            .delete();

        await connection('users')
            .where({ 'id': id })
            .delete();

        promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'temp', 'uploads', key))

        return response.status(204).send();
    },

    async editUser(request, response) {
        const { id, key } = request.params;

        const {
            nome,
            estado_civil,
            cpfNew,
            rg,
            sexo,
            filiacao,
            telefone,
            email,
            endereco,
            numero,
            bairro,
            cidade,
            uf,
            congregacao,
            funcao,
            data_batismo,
            data_nascimento,

        } = request.body;

        const dia_nascimento = data_nascimento.slice(8)
        const mes_nascimento = data_nascimento.slice(5, 7)
        const ano_nascimento = data_nascimento.slice(0, 4)

        const dia_batismo = data_batismo.slice(8)
        const mes_batismo = data_batismo.slice(5, 7)
        const ano_batismo = data_batismo.slice(0, 4)

        await connection('users')
            .where({ 'id': id })
            .update({
                'nome': nome,
                'estado_civil': estado_civil,
                'cpf': cpfNew,
                'rg': rg,
                'sexo': sexo,
                'filiacao': filiacao,
            })

        await connection('adresses')
            .where({ 'user_id': id })
            .update({
                'endereco': endereco,
                'numero': numero,
                'bairro': bairro,
                'cidade': cidade,
                'uf': uf,
            })

        await connection('informations')
            .where({ 'user_id': id })
            .update({
                'email': email,
                'telefone': telefone,
            })

        await connection('churches')
            .where({ 'user_id': id })
            .update({
                'congregacao': congregacao,
            })

        await connection('functions')
            .where({ 'user_id': id })
            .update({
                'funcao': funcao,
            })

        await connection('nascimento')
            .where({ 'user_id': id })
            .update({
                'dia_nascimento': dia_nascimento,
                'mes_nascimento': mes_nascimento,
                'ano_nascimento': ano_nascimento
            })

        await connection('batismo')
            .where({ 'user_id': id })
            .update({
                'dia_batismo': dia_batismo,
                'mes_batismo': mes_batismo,
                'ano_batismo': ano_batismo
            })

        const image = await connection('images')
            .where({ 'key': key })
            .select('key')
            .first();

        if (image) {
            return response.json('Continua a mesma foto')
        } else {
            return response.json('Cliente escolheu outra foto')
        }

    }
}




















