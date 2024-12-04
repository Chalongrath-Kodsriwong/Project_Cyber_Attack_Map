import $ from 'jquery';

let isHidden = true; // Tracks visibility of container-item
let isAnimating = false; // Prevents repeated animations during a single click

export const setupClassificationAnimation = () => {
  $(".Classification").click(function () {
    if (isAnimating) return; // Prevent additional clicks during animation
    isAnimating = true;

    if (isHidden) {
      // Hide container-item and move Classification down
      // $(".container-item").animate(
      //   {
      //     marginBottom: "-100px",
      //     opacity: 0,
      //   },
      //   1000,
      //   () => {
      //     isAnimating = false; // Allow new animation after completion
      //   }
      // );
      $(".Classification").animate(
        {
          marginTop: "240px",
        },
        1000,
        () => {
          isAnimating = false; // Allow new animation after completion
        }
      );
    } else {
      // Show container-item and move Classification up
      // $(".container-item").animate(
      //   {
      //     marginBottom: "0px",
      //     opacity: 1,
      //     transition: "0.3s"
      //   },
      //   1000,
      //   () => {
      //     isAnimating = false; // Allow new animation after completion
      //   }
      // );
      $(".Classification").animate(
        {
          marginTop: "0px",
        },
        1000,
        () => {
          isAnimating = false; // Allow new animation after completion
        }
      );
    }

    isHidden = !isHidden; // Toggle visibility state
  });
};
