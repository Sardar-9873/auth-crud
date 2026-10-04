const validationPipe = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            console.log(error);
            return res.status(422).send({
                data: null,
                message: error.details[0].message,
                error: true
            });
        } else {
            next();
        }
    };
};

module.exports = validationPipe;