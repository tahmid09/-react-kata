import React, { Component } from 'react';
import Papa from 'papaparse';
import './App.css';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class App extends Component {
  constructor(props) {
    super(props);
	 
	 this.state = {
      books: [],
      authors: [],
      magazines: [],
      margedList : [],
      margedArr : []
	 }

   this.GetData = this.GetData.bind(this);
   this.fetchCsv = this.fetchCsv.bind(this);
   this.sort_by_key = this.sort_by_key.bind(this);
   this.JSONToCSVConvertor = this.JSONToCSVConvertor.bind(this);
   this.downloadData = this.downloadData.bind(this);


   
  }

  componentDidMount() {
    var self = this;
    this.GetData('books.csv').then( res => {
      this.state.books = res.data
      res.data.forEach( (elm, index) => {
        if(index > 0) {
          let json = {
            'title' : elm[0],
            'isbn' : elm[1],
            'authors' : elm[2],
            'description' : elm[3],
          }
          this.state.margedList.push(json)
        }
      })
      console.log(this.state.books, 'books');
    } ) 
      this.GetData('authors.csv').then( res => {
        this.state.authors = res.data
      console.log(this.state.authors, 'authors');
      } ) 
      this.GetData('magazines.csv').then( res => {
        this.state.magazines = res.data
        res.data.forEach( (elm, index) => {
          if(index > 0) {
            let json = {
              'title' : elm[0],
              'isbn' : elm[1],
              'authors' : elm[2],
              'description' : elm[3],
            }
            this.state.margedList.push(json)
          }
        })
        self.setState({margedArr: this.sort_by_key(this.state.margedList, 'title')});
        console.log(this.state.margedList, 'magazins');
      } )  
  }

 sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}

  async GetData(filename) {
    const data = Papa.parse(await this.fetchCsv(filename));
    return data;
}

  async fetchCsv(filename) {
    const response = await fetch(filename);
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csv = await decoder.decode(result.value);
    return csv;
}


JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel,lside=false, column = null) {
  delete JSONData.id;

  JSONData.forEach(function (json, index) {
    delete json.id;
    delete json.password;
    delete json.facilitator;
    delete json.documentstatus;
    if (column != null ) {
      // console.log(json);
      let keys = Object.keys(json)
      // console.log(keys);
      keys.forEach(element => {
        let a = column.includes(element);

        if (a == false) {
          delete json[element];
        }
      });

    } else {
      if ( lside != false) {
        if (JSONData[index].side === 'l') {
          JSONData[index].side = 'L1'
        } else {
          JSONData[index].side = 'L2'
        }
      }
    }
  })
  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  var arrData = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;




  //var arrData = delete arrData1[key];
  var CSV = "";
  //Set Report title in first row or line

  CSV += ReportTitle + "\r\n\n";

  //This condition will generate the Label/Header
  if (ShowLabel) {
    var row = "";

    //This loop will extract the label from 1st index of on array
    for (var index in arrData[0]) {
      //Now convert each value to string and comma-seprated
      row += index + ",";
    }

    row = row.slice(0, -1);

    //append Label row with line break
    CSV += row + "\r\n";
  }

  //1st loop is to extract each row
  for (var i = 0; i < arrData.length; i++) {
    var row = "";

    //2nd loop will extract each column and convert it in string comma-seprated
    for (var index in arrData[i]) {
      row += '"' + arrData[i][index] + '",';
    }

    row.slice(0, row.length - 1);

    //add a line break after each row
    CSV += row + "\r\n";
  }

  if (CSV == "") {
    alert("Invalid data");
    return;
  }

  //Generate a file name
  var fileName = "Download_";
  // this will remove the blank-spaces from the title and replace it with an underscore
  fileName += ReportTitle.replace(/ /g, "_");

  //Initialize file format you want csv or xls
  var uri = "data:text/csv;charset=utf-8," + escape(CSV);

  const link = document.createElement("a");
  link.href = uri;

  //set the visibility hidden so it will not effect on your web-layout
  link.style.visibility = "hidden";
  link.download = fileName + ".csv";

  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

downloadData () {
  this.JSONToCSVConvertor(this.state.margedArr, 'booklist', true)
}


  render() {
    
    return (
       <div>
         <Button variant="contained" onClick={this.downloadData} color="primary">
         Exporting
</Button>
            <TableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title </TableCell>
            <TableCell >ISBN</TableCell>
            <TableCell >Authors</TableCell>
            <TableCell >Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.margedArr.map((row, index) => (
            <TableRow key={index}>
              <TableCell >{row.title}</TableCell>
              <TableCell >{row.isbn}</TableCell>
              <TableCell >{row.authors}</TableCell>
              <TableCell >{row.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
       </div>
    )
  }

  }
  
  export default App;
  

// const App = () => {
//   console.log('Hello world!');
// };

// export default App;
