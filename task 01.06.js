const { createStore, combineReducers, applyMiddleware, compose } = Redux;
const initialList = [
    { id: 1, text:"Lorem ipsum dolor sit amet, \nconsectetur adipiscing elit, sed do\n eiusmod tempor incididunt ut labore\n  et dolore magna aliqua. Ut enim ad\n   minim veniam, quis nostrud exercitation\n    ullamco laboris nisi ut aliquip ex ea commodo \n    consequat. Duis aute irure dolor in reprehenderit \n    in voluptate velit esse cillum dolore eu fugiat nulla pariatur."},
    { id: 2, text:"Nemo"},
    { id: 3, text:"Sed ut perspiciatis unde omnis iste natus error sit"},
    { id: 4, text:"Lorem ipsum "},
    { id: 5, text:"Ut enim ad"}
    ];
const data=document.querySelector('.tabs');
const getButtons = (id, isLast) => {
    if (id === 1) {
        return `<button data-action="NEXT" data-page=${id}>Следующая вкладка</button>`
    }
    if (isLast) {
        return `<button data-action="PREV" data-page=${id}>Предыдущая вкладка</button>`
    }
    return `<button data-action="PREV" data-page=${id}>Предыдущая вкладка</button>
    <button data-action="NEXT" data-page=${id} >Следующая вкладка</button>`
};
const templateprevnext= (id, isLast, curInd, text)=>`
        <input type="radio" id=tab${id} name="tab-group" ${curInd+1===id && 'checked'} >
    <label for="tab${id}" class="tab-title" data-action="SET_CURRENT" data-page=${id}>${id}</label>
        <section class="tab-content"><p>
        ${text}
</p>
            ${getButtons(id,isLast )}
        </section>`;

function currentIndexReducer(state = 0, action) {

    if (action.type==='NEXT'){
        return state + 1;
    }
    if (action.type==='PREV'){
        return state - 1;
    }
    if (action.type==='SET_CURRENT'){
         return Number(action.payload) - 1;
    }
    return state;

}

const listReducer = (state = initialList) => state;

const rootReducer = combineReducers({
    list: listReducer,
    currentIndex: currentIndexReducer,
});

const store = createStore(rootReducer);
function render()
{
    const my_state=store.getState();
    data.innerHTML="";
    for (var i = 0; i < my_state.list.length; i++) {
        const isLast = i === my_state.list.length - 1;
        const item = document.createElement('div');
        item.setAttribute('class', 'tab');
        item.innerHTML = templateprevnext(i + 1, isLast, my_state.currentIndex, my_state.list[i].text);
        data.appendChild(item);
    }
}
render();
store.subscribe(render);

console.log(store.getState());
data.addEventListener('click', function(el) {
    let data_id = el.target.getAttribute("data-page");
    let data_action = el.target.getAttribute("data-action");
    if (data_action === 'NEXT')
        store.dispatch({type: 'NEXT'});
    if (data_action === 'PREV')
        store.dispatch({type: 'PREV'});
    if(data_action==='SET_CURRENT')
        store.dispatch({type: 'SET_CURRENT', payload:data_id});

});

