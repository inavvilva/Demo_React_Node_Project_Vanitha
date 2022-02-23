exports.createResponse = createResponse;

function createResponse(res, status ,data){

    return res.status(status).send({
        'status'  : status,
        'data'    : data,
      
    });
}