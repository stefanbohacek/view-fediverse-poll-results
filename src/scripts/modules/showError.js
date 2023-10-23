const showError = (error) => {
  alert({
    general: "Unable to process the poll at this time.",
    not_supported: "This platform is not yet supported."
  }[error]);
};

export default showError;
