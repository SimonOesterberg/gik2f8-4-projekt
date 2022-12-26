class MenuApi {
    url = '';
  
    constructor(url) {
      this.url = url;
    }
   
    getAll() {
      return fetch(this.url)
        .then((result) => result.json())
        .then((data) => data)
        .catch((err) => console.log(err));
    }

    /* getItem(id) {
        return fetch(`${this.url}/${id}`)
          .then((result) => result.json())
          .then((data) => data)
          .catch((err) => console.log(err));
      }
 */
}