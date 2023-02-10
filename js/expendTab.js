function expend(tab)
{
  tab.classList.toggle("active");
  var content = tab.nextElementSibling;
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
    content.style.padding = "0px";
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
    content.style.paddingLeft = "20px";
  }
}
