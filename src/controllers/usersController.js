const connection = require('../database/connection');

module.exports = {

    async index(request, response){

        const users = await connection('users')
        .select('*')

        return response.json(users);
    },

    async selectSpecificUser(request, response){
        const { cpf } = request.params;

        const userId = await connection('users')
            .where({'cpf': cpf  })
            .select('id')
            .first();

        response.json(userId);
    },

    async create(request, response){
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

        if(!user){
            
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
            .where({'cpf': cpf  })
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

    async createImage(request, response){
        const {id} = request.params;

        await connection('images')
            .insert({    
                nome: request.file.originalname,
                key: request.file.filename,
                size: request.file.size,
                user_id: id
            })
        
        return response.json(200).send();
    }
}




















