const defaultPage = 0;
const defaultLimit = 0;

function paginateResponds(query){
    const page = query.page || defaultPage;
    const limit = query.limit || defaultLimit;

    const skip = (page - 1) * limit;

    return {
        limit,
        skip
    }
}

module.exports = paginateResponds