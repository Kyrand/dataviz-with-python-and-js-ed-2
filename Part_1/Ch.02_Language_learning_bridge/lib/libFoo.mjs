export let findOdds = (a) => {
  return a.filter(x => x%2)
}

let api = {findOdds}

export default api
