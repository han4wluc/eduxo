
import * as React from 'react';

export interface IPropStates {
    isLoading: boolean
}

export interface IProps {
    doSomething: (a:number,b:string) => void,
}

export interface IProps2 extends IPropStates, IProps {};

class MyComp extends React.Component<IProps2> {
    public componentDidMount() {
        const a = this.props.count;
    }

    public render() {
        return (
            <button className="button" id="button" onClick={()=>{this.props.doSomething(1,'sdf')}}/>
        )
    }
}

export default MyComp;

