import React, {useState} from 'react'
import { Collapse, Checkbox } from 'antd';

const { Panel } = Collapse; 

function CheckBox(props) {

    const [Checked, setChecked] = useState([])

    const handleToggle = (value) => {
        // checked 된 index
        const currentIndex = Checked.indexOf(value)
        //전체 checked 된 state에서 현재 누른 checkbox가 이미 있으면 빼주고 없으면 넣어준다.
        const newChecked = [...Checked]
        if(currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked)
        props.handleFilters(newChecked) //부모 컴포넌트에 전달
    }

    const renderCheckBoxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index}>
            <Checkbox onChange={() => handleToggle(value._id)} 
                checked={Checked.indexOf(value._id) === -1 ? false : true}/>
                <span>{value.name}</span>

        </React.Fragment>
    ))

    return (
        <div>
            <Collapse defaultActiveKey={['0']} >
                <Panel header="category" key="1">
                    {renderCheckBoxLists()}
                </Panel>
                
            </Collapse>
        </div>
    )
}

export default CheckBox
