const { createStore, applyMiddleware, compose } = Redux;

// Object.assign({}, obj)
const initialState = {
    list: [
        { id: 1, text: 'text1', isEditMode: false },
        { id: 2, text: 'text2', isEditMode: false },
        { id: 3, text: 'text3', isEditMode: false },
    ]
};

var increment = 4;

function reducer(state, action) {
    if (action.type === 'ADD') {
        const newState = { ...state };
        const { list } = newState;

        list.push({
            id: increment,
            text: action.payload,
            isEditMode: false,
        });

        increment++;

        return newState;
    }

    if (action.type === 'DELETE') {
        const newState = { ...state };

        newState.list = state.list.filter(
            item => item.id !== action.payload
        );

        return newState;
    }

    if (action.type === 'EDIT') {
        const newState = { ...state };
        const node = newState.list.find(
            item => item.id === action.payload
        );

        if (node) {
            node.isEditMode = true;

            return newState;
        }

        return state;
    }

    if (action.type === 'OK') {
        const newState = { ...state };
        const node = newState.list.find(
            item => item.id === action.payload.id
        );
        if (node) {
            node.isEditMode = false;
            node.text=action.payload.text;
            return newState;
        }

        return state;
    }

    if (action.type === 'CANCEL') {
        const newState = { ...state };
        const node = newState.list.find(
            item => item.id === action.payload
        );

        if (node) {
            node.isEditMode = false;

            return newState;
        }

        return state;
    }

    return state;
}

const middleware = () => next => action => {
console.log(action);
return next(action);
};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState);

store.dispatch({ type: 'ADD', payload: 'text1111' });
console.log(store);
store.dispatch({ type: 'DELETE', payload: '1' });
store.dispatch({type:'EDIT',  payload:'2'});
store.dispatch({type:'EDIT',  payload:'555'});
store.dispatch({type:'OK',  payload:{id:'2', text:'asd'}});
store.dispatch({type:'CANCEL',  payload:'2'});
console.log(store.getState());
const template = ({ id, text }) => `
    <div class="text">${text}</div>
    <div class="button-block">
        <button data-action="DELETE" data-id="${id}">delete</button>
        <button data-action="EDIT"  data-id="${id}">edit</button>
    </div>
`
const template_edit = ({ id, text }) => `
    <input class="text input-text" value="${text}" data-id="${id}">
    <div class="button-block">
        <button data-action="OK" data-id="${id}">Ok</button>
        <button data-action="CANCEL"  data-id="${id}">Cancel</button>
    </div>
`
const list = document.querySelector('.todo-list');
const template_func =(record)=>{
    if (record.isEditMode){
        return template_edit(record);
    }
    return template(record);
};
function render() {
    const data = store.getState().list;
    list.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        const item = document.createElement('li');
        item.setAttribute('class', 'todo-list__item');
        item.innerHTML = template_func(data[i]);
        list.appendChild(item);
    }

}
store.subscribe(render);
render();
const buttonAdd = document.querySelector('.input-block button');
const edit=document.querySelector('.text');

buttonAdd.addEventListener('click', function () {
    store.dispatch({ type: 'ADD', payload: edit.value })
});


list.addEventListener('click', function(el) {
    let data_id = el.target.getAttribute("data-id");
    let data_action=el.target.getAttribute("data-action");
    if (data_action==='EDIT'|| data_action==='CANCEL'||data_action==='DELETE'){

        store.dispatch({type:data_action, payload:Number(data_id)});
    }
    if(data_action==='OK'){
        store.dispatch({type:'OK', payload:{id:Number(data_id), text:document.querySelector(`.text.input-text[data-id="${data_id}"]`).value}});
    }
});
