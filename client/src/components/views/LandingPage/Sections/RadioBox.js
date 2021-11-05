import React, {useState} from 'react'
import { Collapse, Radio } from 'antd';

const { Panel } = Collapse; 

function RadioBox(props) {

    const [Value, setValue] = useState(0)

    const renderRadioBox = () => (                                                                                  //왜 중괄호가 아니라 소괄호지??????
        props.list && props.list.map(value => ( //value 옆에 , index 를 주고
            <Radio key={value._id} value={value._id}> {value.name} </Radio>    //여기에서 value._id 대신 index를 써도 된다. 값은 Datas.js 의 id이다
        ))
    )

    const handleChange = (event)=> {
        setValue(event.target.value)
        props.handleFilters(event.target.value)
    }

    return (
        <div>{/*가격 radiobox가 기본은 닫힘으로 설정*/}
            <Collapse defaultActiveKey={['0']} >    
                <Panel header="price" key="1">
                    <Radio.Group onChange={handleChange} value={Value}> {/*이 줄의 value값과 위의 value값이 같으면 선택이 된거*/}
                        {renderRadioBox()}
                    </Radio.Group>
                </Panel>
                
            </Collapse>
        </div>
    )
}

export default RadioBox 
