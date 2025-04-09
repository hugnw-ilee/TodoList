import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: "",
      list: [],
      completedList: [],
    };
  }

  updateInput = (value) => {
    this.setState({ userInput: value });
  };

  addItem = () => {
    const { userInput } = this.state;
    if (!userInput.trim()) return;

    this.setState((prevState) => ({
      list: [
        ...prevState.list,
        {
          id: Date.now(),
          value: userInput.trim(),
        },
      ],
      userInput: "",
    }));
  };

  deleteItem = (id) => {
    this.setState((prevState) => ({
      list: prevState.list.filter((item) => item.id !== id),
    }));
  };

  editItem = (id) => {
    const { list } = this.state;
    const item = list.find((item) => item.id === id);
    if (!item) return;

    const editedValue = prompt("Sửa công việc:", item.value);
    if (editedValue && editedValue.trim()) {
      this.setState((prevState) => ({
        list: prevState.list.map((item) =>
          item.id === id ? { ...item, value: editedValue.trim() } : item
        ),
      }));
    }
  };

  completeItem = (id) => {
    this.setState((prevState) => {
      const item = prevState.list.find((item) => item.id === id);
      if (!item) return prevState;

      return {
        list: prevState.list.filter((item) => item.id !== id),
        completedList: [...prevState.completedList, item],
      };
    });
  };

  render() {
    return (
      <Container>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "3rem",
            fontWeight: "bolder",
          }}
        >
          TODO LIST
        </Row>

        <hr />
        <Row>
          <Col md={{ span: 2 }} className="bg-dark text-white p-3">
            <h5>Công việc đã hoàn thành</h5>
            <ListGroup>
              {this.state.completedList.map((item) => (
                <ListGroup.Item key={item.id} variant="success">
                  {item.value}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          <Col md={{ span: 6, offset: 1 }}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Thêm công việc . . . "
                size="lg"
                value={this.state.userInput}
                onChange={(e) => this.updateInput(e.target.value)}
                aria-label="Thêm gì đó"
                aria-describedby="basic-addon2"
              />
              <InputGroup>
                <Button
                  variant="dark"
                  className="mt-2"
                  onClick={this.addItem}
                >
                  Thêm
                </Button>
              </InputGroup>
            </InputGroup>

            <ListGroup>
              {this.state.list.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  variant="dark"
                  action
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {item.value}
                  <div>
                    <Button
                      variant="light"
                      style={{ marginRight: "10px" }}
                      onClick={() => this.deleteItem(item.id)}
                    >
                      Xóa
                    </Button>
                    <Button
                      variant="light"
                      style={{ marginRight: "10px" }}
                      onClick={() => this.editItem(item.id)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="light"
                      onClick={() => this.completeItem(item.id)}
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