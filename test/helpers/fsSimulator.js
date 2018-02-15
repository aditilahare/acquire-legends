class fsSimulator{
  constructor(){
    this.files={};
  }

  addFile(name,content){
    this.files[name]=content;
  }

  readFileSync(fileName,encoding='utf8'){
    if(!this.existsSync(fileName)){
      return 'no such file or directory';
    }
    return this.files[fileName];
  }

  existsSync(fileName){
    return Object.keys(this.files).includes(fileName);
  }

  appendFile(fileName,content,func){
    this.files[fileName]+=content;
    return func();
  }

  writeFileSync(fileName,content){
    this.files[fileName] = content;
  }

}

module.exports=fsSimulator;
