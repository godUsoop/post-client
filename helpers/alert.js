const successMessageBox = (success) => {
    return (
        <div className="alert alert-success">
            {success}
        </div>
    )
}

const errorMessageBox = (error) => {
    return (
        <div className="alert alert-danger">
            {error}
        </div>
    )
}


export {successMessageBox, errorMessageBox}