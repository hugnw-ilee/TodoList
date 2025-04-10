import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      list: [],
      completedList: [],
    };
  }

  componentDidMount() {
    axios.get("http://localhost:8000/api/todos")
      .then(response => {
        this.setState({
          list: response.data.filter(todo => !todo.IsDone),
          completedList: response.data.filter(todo => todo.IsDone),
        });
      })
      .catch(error => console.error("Lỗi khi tải dữ liệu:", error));
  }

  updateInput = (e) => {
    this.setState({ content: e.target.value });
  };

  addItem = () => {
    const { content } = this.state;
    if (!content.trim()) return;

    axios.post("http://localhost:8000/api/todos", { Content: content.trim() })
      .then(response => {
        this.setState(prevState => ({
          list: [...prevState.list, response.data],
          content: "",
        }));
      })
      .catch(error => console.error("Lỗi khi thêm công việc:", error));
  };

  deleteItem = (id) => {
    axios.delete(`http://localhost:8000/api/todos/${id}`)
      .then(() => {
        this.setState(prevState => ({
          list: prevState.list.filter(item => item.ID !== id), 
          completedList: prevState.completedList.filter(item => item.ID !== id), 
        }));
      })
      .catch(error => console.error("Lỗi khi xóa công việc:", error));
  };

  editItem = (id) => {
    const { list } = this.state;
    const item = list.find(item => item.ID === id); 
    if (!item) return;

    const editedContent = prompt("Sửa công việc:", item.Content); 
    if (editedContent && editedContent.trim()) {
      axios.put(`http://localhost:8000/api/todos/${id}`, {
        Content: editedContent.trim() 
      })
        .then(response => {
          this.setState(prevState => ({
            list: prevState.list.map(item =>
              item.ID === id ? { ...item, Content: response.data.Content } : item 
            ),
          }));
        })
        .catch(error => console.error("Lỗi khi sửa công việc:", error));
    }
  };

  completeItem = (id) => {
    axios.put(`http://localhost:8000/api/todos/${id}/complete`)
      .then(response => {
        this.setState(prevState => ({
          list: prevState.list.filter(item => item.ID !== id), 
          completedList: [...prevState.completedList, response.data],
        }));
      })
      .catch(error => console.error("Lỗi khi hoàn thành công việc:", error));
  };

  render() {
    return (
      <Container>
        <Row style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          fontSize: "3rem", 
          fontWeight: "bolder" 
        }}>
          TODO LIST
        </Row>
        <hr />
        <Row>
          <Col md={{ span: 2 }} className="bg-dark text-white p-3">
            <h5>Công việc đã hoàn thành</h5>
            <ListGroup>
              {this.state.completedList.map((item) => (
                <ListGroup.Item key={item.ID} variant="success"> 
                  {item.Content} 
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          
          <Col md={{ span: 6, offset: 1 }}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Thêm công việc . . . "
                size="lg"
                value={this.state.content}
                onChange={this.updateInput}
                aria-label="Thêm công việc"
              />
              <Button variant="dark" onClick={this.addItem}>Thêm</Button>
            </InputGroup>
            
            <ListGroup>
              {this.state.list.map((item) => (
                <ListGroup.Item 
                  key={item.ID} 
                  variant="dark" 
                  action 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center" 
                  }}
                >
                  {item.Content}
                  <div>
                    <Button 
                      variant="light" 
                      style={{ marginRight: "10px" }} 
                      onClick={() => this.deleteItem(item.ID)}
                    >
                      Xóa
                    </Button>
                    <Button 
                      variant="light" 
                      style={{ marginRight: "10px" }} 
                      onClick={() => this.editItem(item.ID)} 
                    >
                      Sửa
                    </Button>
                    <Button 
                      variant="light" 
                      onClick={() => this.completeItem(item.ID)} 
                    >
                      Xong
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;