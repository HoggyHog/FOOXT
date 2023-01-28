const selectBtnRoti = document.querySelector(".select-btn-roti"),
        selectBtnRice = document.querySelector(".select-btn-rice"),
        selectBtnDal = document.querySelector(".select-btn-dal"),
        selectBtnSabzi = document.querySelector(".select-btn-sabzi"),
        items = document.querySelectorAll(".item");

selectBtnRoti.addEventListener("click", () => {
    selectBtnRoti.classList.toggle("open");
});

selectBtnRice.addEventListener("click", () => {
    selectBtnRice.classList.toggle("open");
});

selectBtnDal.addEventListener("click", () => {
    selectBtnDal.classList.toggle("open");
});

selectBtnSabzi.addEventListener("click", () => {
    selectBtnSabzi.classList.toggle("open");
});

items.forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle("checked");

        let checked = document.querySelectorAll(".checked"),
            btnText = document.querySelector(".btn-text");

            if(checked && checked.length > 0){
                btnText.innerText = `${checked.length} Selected`;
            }else{
                btnText.innerText = "Select Language";
            }
    });
})


