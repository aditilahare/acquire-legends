let chai = require('chai');
let assert = chai.assert;
let MockFs = require('../helpers/fsSimulator.js');

describe('MockFs', () => {
  let fs;
  before(() => {
    fs = new MockFs();
  });
  describe('#addFile(name,content)', () => {
    it('Should add new file with given content', () => {
      let fileName = 'NewFile';
      let content = 'This is my new File';
      fs.addFile(fileName, content);
      assert.include(fs.files, {
        'NewFile': content
      });
    });
  });
  describe('#readFileSync(name,content)', () => {
    it('Should read contents of given file', () => {
      let fileName = 'NewFile';
      let content = 'This is my new File';
      let fileContent = fs.readFileSync(fileName);
      assert.equal(fileContent, content);
    });
    it('Should return error message if given bad file', () => {
      let fileName = 'bad_File';
      let fileContent = fs.readFileSync(fileName);
      assert.equal(fileContent, 'no such file or directory');
    });
  });
  describe('#existsSync(name)', () => {
    it('Should return true if file exists', () => {
      let fileName = 'NewFile';
      assert.isOk(fs.existsSync(fileName));
    });
    it('Should return false if file does not exists', () => {
      let fileName = 'Bad_File';
      assert.isNotOk(fs.existsSync(fileName));
    });
  });
  describe('#appendFile(name)', () => {
    it('Should add new content concating old content', () => {
      let fileName = 'NewFile';
      let oldContent = fs.readFileSync(fileName);
      let newContent = 'This my new content';
      fs.appendFile(fileName, newContent,function callback(){
        return ;
      });
      let fileContent = fs.readFileSync(fileName);
      assert.equal(oldContent + newContent, fileContent);
    });
  });
  describe('#writeFileSync(name)', () => {
    it('Should write the file with given content', () => {
      let fileName = 'NewFile';
      let newContent = 'Testing writeFileSync';
      fs.writeFileSync(fileName, newContent);
      let fileContent = fs.readFileSync(fileName);
      assert.equal(newContent, fileContent);
    });
  });

});
