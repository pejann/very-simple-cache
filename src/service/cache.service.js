const getNowTimestamp = () => Math.round(new Date().getTime() / 1000)

const livefor = seconds => {

    if (typeof seconds === 'string') seconds = parseInt(seconds)

    return getNowTimestamp() + seconds

}

const now = () => getNowTimestamp()

/**
 * Retorna um registro do cache pela chave ou, caso não encontre o registro, retorna null
 * @param {object} cacheHandler
 * @return {function}
 */
const get = (cacheHandler) => key => {

    return cacheHandler.get(key).then(entidade => {

        if (entidade && entidade.dtExpiracao) {

            if (now() > entidade.dtExpiracao) {

                return cacheHandler
                    .remove(entidade)
                    .then(() => Promise.resolve(null))
                    .catch(() => Promise.resolve(null))

            }

            return Promise.resolve(entidade)

        }

        return Promise.resolve(null)

    })

}

/**
 * Atualiza ou insere (caso a chave já exista) um dado no cache baseado em sua chave
 * @param {object} cacheHandler
 * @return {function}
 */
const upsert = (cacheHandler) => (key, data, ttlInSeconds = 7200) =>
    cacheHandler.upsert(key, data, livefor(ttlInSeconds))

/**
 * Remove um objeto do cache por sua chave
 * @param {object} cacheHandler Chave para buscar no cache
 * @return {function}
 */
const remove = (cacheHandler) => key => cacheHandler.remove(key)

/**
 * Pega dados no cache ou, caso não consiga encontrar dados, executa a função para computar os dados e os armazena
 * com a chave passada
 * @param {object} cacheHandler
 * @return {function}
 */
const getOrCacheThat = (cacheHandler) => (key, fn, ttl = 3600) => {

    return get(cacheHandler)(key).then(hit => {

        if (hit) {

            return Promise.resolve(hit.dado)

        }

        const promise = Promise.resolve(fn())
        return promise.then(computed => {

            upsert(cacheHandler)(key, computed, ttl)

            return Promise.resolve(computed)

        })

    })

}

const createCacheService = (cacheHandler) => {

    if (cacheHandler === null ||
        cacheHandler === undefined ||
        typeof cacheHandler !== 'object' ||
        typeof cacheHandler.getMonth === 'function' ||
        typeof cacheHandler.get !== 'function' ||
        typeof cacheHandler.upsert !== 'function' ||
        typeof cacheHandler.remove !== 'function') {

        throw new SyntaxError('Cache Handler should be a valid module')

    }

    return {
        get: get(cacheHandler),
        upsert: upsert(cacheHandler),
        remove: remove(cacheHandler),
        getOrCacheThat: getOrCacheThat(cacheHandler)
    }

}

module.exports = {
    createCacheService
}
