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
            .innerJoin('images', 'users.id', 'images.user_id')
            .select(
                'users.*',
                'images.key',
                'images.size',
                'images.created_at',
                'adresses.*',
                'churches.*',
                'informations.*',
                'functions.*'
            )

        return response.json(users);
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
                'functions.*'
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
                    filiacao,
                    data_nascimento,
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
                    data_batismo,
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
            .innerJoin('images', 'users.id', 'images.user_id')
            .where({ 'cpf': cpf })
            .select('users.*', 'images.key', 'images.size', 'images.created_at', 'adresses.*', 'churches.*', 'informations.*', 'functions.*')

        return response.json(user);
    },

    async deleteUser(request, response) {
        const { id, key } = request.params;

        try {
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

            await connection('users')
                .where({ 'id': id })
                .delete();

            return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'temp', 'uploads', key))
        } catch (error) {
            console.log(error.response)
        }

        return response.json('Excluído com sucesso')
    },

    async editUser(request, response){
        const { id, key} = request.params;

        const {
            nome,
            estado_civil,
            cpfNew,
            rg,
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

        await connection('users')
        .where({'id': id})
        .update({
            'nome': nome,
            'estado_civil': estado_civil,
            'cpf': cpfNew,
            'rg': rg,
            'filiacao': filiacao,
            'data_nascimento': data_nascimento
        })

        await connection('adresses')
        .where({'user_id': id})
        .update({
            'endereco': endereco,
            'numero': numero,
            'bairro': bairro,
            'cidade': cidade,
            'uf': uf,
        })
        
        await connection('informations')
        .where({'user_id': id})
        .update({
            'email': email,
            'telefone': telefone,
        })

        await connection('churches')
        .where({'user_id': id})
        .update({
            'congregacao': congregacao,
        })
        
        await connection('functions')
        .where({'user_id': id})
        .update({
            'funcao': funcao,
            'data_batismo': data_batismo,
        })

        const image = await connection('images')
        .where({'key': key})
        .select('key')
        .first();

        if (image) {
            return response.json('Continua a mesma foto')
        }else {
            return response.json('Cliente escolheu outra foto')
        }

    }
}




















