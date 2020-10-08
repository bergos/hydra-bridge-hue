async function get (req, res) {
  res.dataset(req.hydra.resource.dataset)
}

export {
  get
}
