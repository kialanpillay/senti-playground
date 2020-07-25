//Encodes a querystring from a JSON object of parameters

export default function queryBuilder(params){
  let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
  return query;
};
