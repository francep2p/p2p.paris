$(function() {
  const chunkSize = 3;
  const upcomingEvents = $('#upcoming-events');
  const loadMore = upcomingEvents.find('#loadmore');
  const items = () => upcomingEvents.find('.event-item:hidden');

  changeLoadmore();

  loadMore.on('click', function (e) {
    e.preventDefault();

    items().slice(0, chunkSize).slideDown();
    changeLoadmore();
  });

  function changeLoadmore() {
    const remainingItems = items();
    const nextItemsCount = Math.min(remainingItems.length, chunkSize);
    loadMore.html(`view ${nextItemsCount} more upcoming events`);

    if (remainingItems.length == 0) {
      loadMore.fadeOut('slow');
    }
  }
}); 