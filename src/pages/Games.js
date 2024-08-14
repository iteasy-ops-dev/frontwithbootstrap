import React, { useState } from 'react';
import { InputGroup, Button, Form, Row, Col } from 'react-bootstrap';
import { Wheel } from 'react-custom-roulette';
import { useTheme } from '../ThemeContext';

const colors = ['lightsalmon', 'lightcoral', 'lightblue', 'orange', 'lightseagreen'];

const initRouletteData = (arr) => {
    return arr.map((str, index) => ({
        option: str || `Option ${index + 1}`,
        style: { backgroundColor: colors[index % colors.length] }
    }));
};

const Roulette = () => {
    const { theme } = useTheme();
    const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [fieldAmount, setFieldAmount] = useState(4);
    const [rouletteData, setRouletteData] = useState(initRouletteData(Array(fieldAmount).fill('')));

    const handleAddField = () => {
        const newRouletteData = [...rouletteData, { option: `Option ${rouletteData.length + 1}`, style: { backgroundColor: colors[rouletteData.length % colors.length] } }];
        setRouletteData(newRouletteData);
        setFieldAmount(newRouletteData.length);
    };

    const handleSubField = () => {
        if (rouletteData.length > 1) {
            const newRouletteData = rouletteData.slice(0, -1);
            setRouletteData(newRouletteData);
            setFieldAmount(newRouletteData.length);
        }
    };

    const handleInputChange = (index, e) => {
        const { value } = e.target;
        const newRouletteData = [...rouletteData];
        newRouletteData[index].option = value;
        setRouletteData(newRouletteData);
    };

    const handleSpinClick = () => {
        if (!mustSpin) {
            const newPrizeNumber = Math.floor(Math.random() * rouletteData.length);
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true);
        }
    };

    return (
        <>
            <h1 className={`header-title ${textColorClass}`}>Roulette</h1>
            <p className={`header-description ${textColorClass}`}>Joy!</p>
            <Row>
                <Col>
                    <Wheel
                        mustStartSpinning={mustSpin}
                        prizeNumber={prizeNumber}
                        data={rouletteData}
                        fontFamily={"Roboto"}
                        onStopSpinning={() => {
                            setMustSpin(false);
                        }}
                    />
                </Col>
                <Col>
                    <Button className="w-100 mb-3" variant={`outline-${theme === 'light' ? 'dark' : 'light'}`} onClick={handleSpinClick}>
                        Spin
                    </Button>
                    {rouletteData.map((input, index) => (
                        <InputGroup className="mb-3" data-bs-theme={`${theme}`} key={index}>
                            <InputGroup.Text>Field {index + 1}</InputGroup.Text>
                            <Form.Control
                                type="text"
                                value={input.option}
                                onChange={(e) => handleInputChange(index, e)}
                                required
                            />
                        </InputGroup>
                    ))}
                    <Button className="w-100 mb-3" variant={`outline-${theme === 'light' ? 'dark' : 'light'}`} onClick={handleAddField}>
                        <i className="bi bi-plus-circle-fill"></i> Add Field
                    </Button>
                    <Button className="w-100 mb-3" variant={`outline-${theme === 'light' ? 'dark' : 'light'}`} onClick={handleSubField}>
                        <i className="bi bi-dash-circle-fill"></i> Sub Field
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default Roulette;
