
function handleFileRead(res) {
    return (err, data) => { 
        if(err) {
            console.error(err);
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('404 NOT FOUND');
        } else {
            res.end(data);
        }
    }
}
    
module.exports = { handleFileRead };

