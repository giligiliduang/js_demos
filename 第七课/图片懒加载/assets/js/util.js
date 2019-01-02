function fetchApiRequest(url,querystring,ops=null) {
    let fetchVal=''
    async function fetchUserdetail(url) {
        let res = await fetch(url)
        return res
    }
    const res = fetchUserdetail('https://api.github.com/users/giligiliduang')
    res.then(response => {
        response.json().then(val => {
            fetchVal=val
        })
    })
return fetchVal            
}

function axiosApiRequest(url,querystring={},ops=null){
    let tmp=[]
    for(let k in querystring){
        tmp.push(k+'='+querystring[k])
    }
    tmp=tmp.join('&')
    url=tmp===''?url:'?'+tmp
    let axiosVal=''
    function axiosUserdetail(url,ops=null){
        let res= axios.get(url,ops)
        res.then(response=>{
            axiosVal=res.data
        })
        
    }
    axiosUserdetail(url)
    return axiosVal
}