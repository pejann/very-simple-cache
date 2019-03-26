/**
 * Armazenamento em memória
 * @type {object}
 */
const storage = {}

/**
 * Recupera um valor referente a uma chave passada como parâmetro, da memória
 * @param { string } key Chave do cache
 * @returns { Promise<any> }
 */
const get = (key) => {

    if (!storage[key]) {

        return Promise.resolve(null)

    }

    return Promise.resolve(storage[key])

}

/**
 * Insere um novo registro no cache ou atualiza um registro já existente, quando
 * a chave já for referenciada na memória
 * @param { string } key Chave para ser inserida (ou atualizada) no cache
 * @param { * } data Objeto ou valor que deve ser inserido no cache
 * @param { number } expirationTimestamp Timestamp que o cache deve ser expirado
 * @returns {Promise<any>}
 */
const upsert = (key, data, expirationTimestamp) => {

    return get(key).then(entidade => {

        if (entidade) {

            storage[key] = {
                dtExpiracao: expirationTimestamp,
                dado: data
            }

        } else {

            storage[key] = {
                chave: key,
                dtExpiracao: expirationTimestamp,
                dado: data
            }

        }

        return Promise.resolve(storage[key])

    })

}

/**
 * Remove uma chave do cache
 * @param { string } key A chave a ser removida do cache
 * @returns { Promise<boolean> }
 */
const remove = (key) => {

    return get(key).then(entidade => {

        if (entidade) {

            delete storage[key]

        }

        return Promise.resolve(true)

    })

}

/**
 * Volta o cache ao seu estado inicial, removendo todas as chaves e valores
 * @return true
 */
const flush = () => {

    Object.keys(storage).map(key => {

        delete storage[key]

    })

    return Promise.resolve(true)

}

module.exports = {
    get,
    upsert,
    remove,
    flush
}
