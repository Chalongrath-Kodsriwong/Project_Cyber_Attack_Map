import $ from "jquery";

let isHiddens = true; // Tracks visibility of tableContainer
let isAnimatings = false; // Prevents repeated animations during a single click

export const setupDataAttackerAnimation = () => {
  // $(".DataAttacker_log").css({
  //   "z-index": "999",
  //   outline: "1px solid red",
  // });

  $(".DataAttacker_log").click(function () {
    if (isAnimatings) return; // Prevent additional clicks during animation
    isAnimatings = true;

    if (isHiddens) {
      // Show tableContainer
      $(".bottom_right").animate(
        {
          marginTop: "240px", // Move to visible position
        }
        ,
        1000,
        () => {
          isAnimatings = false; // Allow new animation after completion
        }
      );
    } else {
      // Hide tableContainer
      $(".bottom_right").animate(
        {
          marginTop: "0px", // Move to hidden position
        }
        ,
        1000, // Duration of 500ms
        () => {
          isAnimatings = false; // Allow new animation after completion
        }
      );
    }
    isHiddens = !isHiddens; // Toggle visibility state
  });
};
