exports.index = async(req, res) => {
  try{
    return res.status(200).send({ message:'Hello From Backend!'})
  } catch (err) {
    return res.status(500).send({ message: 'Error' })
  }
}