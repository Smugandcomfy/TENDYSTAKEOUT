import { SvgIcon, useTheme, SvgIconProps } from "@mui/material";
import { Theme } from "@mui/material/styles";

export default function NoDataIcon(props: SvgIconProps) {
  const theme = useTheme() as Theme;

  return theme.customization.theme === "dark" ? (
    <SvgIcon viewBox="0 0 127 112" {...props}>
      <path
        d="M118.908 63.9278L96.9166 34.3004C96.464 33.6897 95.8739 33.1936 95.1939 32.852C94.5139 32.5105 93.7629 32.3332 93.0016 32.3342H26.5951C25.8338 32.3332 25.0828 32.5105 24.4028 32.852C23.7228 33.1936 23.1327 33.6897 22.6801 34.3004L0.688599 63.9278V100.033C0.688599 101.997 1.47087 103.881 2.86333 105.27C4.25579 106.659 6.14437 107.44 8.1136 107.44H111.497C113.466 107.44 115.354 106.659 116.747 105.27C118.139 103.881 118.922 101.997 118.922 100.033L118.908 63.9278Z"
        fill="#4F5A84"
      />
      <path
        d="M111.497 108.1H8.10006C5.95181 108.1 3.89154 107.248 2.3725 105.733C0.85345 104.218 6.10538e-05 102.162 6.10538e-05 100.019V63.9278C-0.00189252 63.7829 0.0430824 63.6412 0.128308 63.5238L22.1198 33.8964C22.6374 33.2023 23.3103 32.6381 24.0848 32.2489C24.8594 31.8596 25.7143 31.656 26.5816 31.6542H92.9881C93.8553 31.656 94.7102 31.8596 95.4848 32.2489C96.2593 32.6381 96.9322 33.2023 97.4498 33.8964L119.441 63.5238C119.527 63.6412 119.572 63.7829 119.57 63.9278V100.033C119.566 102.169 118.715 104.217 117.202 105.728C115.689 107.24 113.638 108.092 111.497 108.1ZM1.36356 64.15V100.033C1.36356 101.819 2.07472 103.531 3.34059 104.794C4.60646 106.057 6.32335 106.766 8.11356 106.766H111.497C113.287 106.766 115.004 106.057 116.27 104.794C117.535 103.531 118.247 101.819 118.247 100.033V64.15L96.3901 34.691C95.9985 34.1658 95.4896 33.739 94.9037 33.4445C94.3178 33.1499 93.6712 32.9957 93.0151 32.9941H26.5951C25.939 32.9957 25.2923 33.1499 24.7064 33.4445C24.1205 33.739 23.6116 34.1658 23.2201 34.691L1.36356 64.15Z"
        fill="#4F5A84"
      />
      <path
        d="M118.908 63.9279V100.033C118.908 101.997 118.126 103.881 116.733 105.27C115.341 106.659 113.452 107.44 111.483 107.44H8.10005C6.13082 107.44 4.24224 106.659 2.84978 105.27C1.45732 103.881 0.675049 101.997 0.675049 100.033V63.9279H32.6768L35.6873 78.7415C35.9597 80.0729 36.6851 81.2694 37.7405 82.1284C38.796 82.9874 40.1166 83.456 41.4788 83.455H78.4958C79.8759 83.4538 81.2122 82.9723 82.2745 82.0934C83.3367 81.2145 84.0581 79.9933 84.3143 78.6405L87.0953 63.8875L118.908 63.9279Z"
        fill="#6F7DB6"
      />
      <path
        d="M26.6559 92.727H13.3989C13.2199 92.727 13.0482 92.656 12.9216 92.5297C12.795 92.4035 12.7239 92.2322 12.7239 92.0536C12.7239 91.875 12.795 91.7037 12.9216 91.5775C13.0482 91.4512 13.2199 91.3802 13.3989 91.3802H26.6559C26.8349 91.3802 27.0066 91.4512 27.1332 91.5775C27.2598 91.7037 27.3309 91.875 27.3309 92.0536C27.3309 92.2322 27.2598 92.4035 27.1332 92.5297C27.0066 92.656 26.8349 92.727 26.6559 92.727Z"
        fill="#4F5A84"
      />
      <path
        d="M35.8357 23.4662C35.6273 23.4651 35.4219 23.416 35.2357 23.3225C35.0495 23.229 34.8876 23.0938 34.7625 22.9275L25.5757 10.8072C25.36 10.5215 25.2669 10.162 25.3169 9.80775C25.3669 9.45354 25.5559 9.13365 25.8424 8.91846C26.1288 8.70327 26.4892 8.6104 26.8443 8.66028C27.1994 8.71016 27.52 8.8987 27.7357 9.18444L36.9157 21.3047C37.1313 21.5896 37.2246 21.9482 37.1753 22.3018C37.1259 22.6553 36.9379 22.9748 36.6525 23.1901C36.4178 23.3687 36.1309 23.4657 35.8357 23.4662Z"
        fill="#A8B1D0"
      />
      <path
        d="M79.3328 23.4662C79.038 23.4633 78.7519 23.3665 78.516 23.1901C78.2307 22.9748 78.0426 22.6553 77.9933 22.3017C77.9439 21.9482 78.0372 21.5896 78.2528 21.3047L87.4395 9.18441C87.6596 8.91204 87.9773 8.7358 88.3254 8.69299C88.6734 8.65018 89.0245 8.74416 89.3044 8.95504C89.5842 9.16592 89.7708 9.47715 89.8246 9.82284C89.8784 10.1685 89.7953 10.5216 89.5928 10.8072L80.4128 22.9275C80.287 23.0947 80.124 23.2305 79.9365 23.324C79.7491 23.4175 79.5424 23.4662 79.3328 23.4662Z"
        fill="#A8B1D0"
      />
      <path
        d="M58.6441 19.4261C58.286 19.4261 57.9427 19.2843 57.6895 19.0317C57.4363 18.7791 57.2941 18.4366 57.2941 18.0794V1.3467C57.2941 0.989533 57.4363 0.646993 57.6895 0.394438C57.9427 0.141883 58.286 0 58.6441 0C59.0021 0 59.3455 0.141883 59.5986 0.394438C59.8518 0.646993 59.994 0.989533 59.994 1.3467V18.0794C59.994 18.4366 59.8518 18.7791 59.5986 19.0317C59.3455 19.2843 59.0021 19.4261 58.6441 19.4261Z"
        fill="#A8B1D0"
      />
      <path
        d="M122.87 87.5826H83.9971C82.5469 87.5826 81.3713 88.7554 81.3713 90.202V107.918C81.3713 109.364 82.5469 110.537 83.9971 110.537H122.87C124.32 110.537 125.496 109.364 125.496 107.918V90.202C125.496 88.7554 124.32 87.5826 122.87 87.5826Z"
        fill="#DFAA21"
      />
      <path
        d="M122.87 111.217H83.997C83.1222 111.215 82.2837 110.868 81.665 110.251C81.0464 109.634 80.6981 108.797 80.6963 107.925V90.202C80.6981 89.3293 81.0464 88.4928 81.665 87.8757C82.2837 87.2586 83.1222 86.9111 83.997 86.9093H122.87C123.745 86.9111 124.584 87.2586 125.202 87.8757C125.821 88.4928 126.169 89.3293 126.171 90.202V107.925C126.169 108.797 125.821 109.634 125.202 110.251C124.584 110.868 123.745 111.215 122.87 111.217ZM83.997 88.256C83.4797 88.256 82.9835 88.461 82.6176 88.826C82.2518 89.1909 82.0463 89.6859 82.0463 90.202V107.925C82.0463 108.441 82.2518 108.936 82.6176 109.301C82.9835 109.666 83.4797 109.871 83.997 109.871H122.87C123.387 109.869 123.882 109.663 124.248 109.299C124.613 108.934 124.819 108.44 124.821 107.925V90.202C124.819 89.6864 124.613 89.1925 124.248 88.8279C123.882 88.4634 123.387 88.2578 122.87 88.256H83.997Z"
        fill="#4F5A84"
      />
      <path
        d="M88.02 94.5046H93.1905V96.0533H89.694V97.4674H92.9948V99.0094H89.694V100.558H93.3795V102.1H88.02V94.5046Z"
        fill="#1C2544"
      />
      <path
        d="M94.5203 96.8613H96.0728V97.5683C96.1272 97.4579 96.2002 97.3577 96.2888 97.2721C96.384 97.1654 96.4956 97.0744 96.6195 97.0027C96.7575 96.9205 96.9048 96.8549 97.0583 96.8075C97.234 96.7579 97.4157 96.733 97.5983 96.7334C97.9356 96.7272 98.2693 96.8034 98.5703 96.9556C98.8591 97.114 99.0852 97.3657 99.2115 97.6693C99.3611 97.3685 99.5957 97.118 99.8865 96.9489C100.179 96.814 100.495 96.7408 100.817 96.7338C101.139 96.7269 101.459 96.7863 101.756 96.9085C101.982 97.0209 102.177 97.1875 102.323 97.3933C102.471 97.6114 102.574 97.8562 102.627 98.1138C102.689 98.4037 102.718 98.6995 102.715 98.9958V102.073H101.102V99.0362C101.106 98.8175 101.053 98.6013 100.946 98.41C100.887 98.3197 100.804 98.2473 100.707 98.201C100.609 98.1546 100.5 98.1361 100.393 98.1474C100.232 98.1426 100.073 98.1748 99.927 98.2417C99.8052 98.296 99.7002 98.3821 99.6233 98.4908C99.5465 98.6055 99.4916 98.7334 99.4613 98.8679C99.4278 99.0159 99.412 99.1673 99.414 99.319V102.073H97.8008V99.319C97.8008 99.2248 97.8008 99.1103 97.8008 98.9756C97.794 98.8421 97.7666 98.7104 97.7198 98.5851C97.6807 98.4642 97.6081 98.3569 97.5105 98.2754C97.3873 98.1861 97.2374 98.141 97.0853 98.1474C96.9116 98.1413 96.7393 98.1808 96.5858 98.2619C96.4602 98.3301 96.3571 98.433 96.2888 98.5582C96.2187 98.6904 96.173 98.8341 96.1538 98.9824C96.1433 99.1483 96.1433 99.3147 96.1538 99.4807V102.073H94.5405L94.5203 96.8613Z"
        fill="#1C2544"
      />
      <path
        d="M104.024 96.8614H105.509V97.5347C105.583 97.4307 105.669 97.3358 105.766 97.2519C105.873 97.1464 105.996 97.0579 106.13 96.9893C106.274 96.9094 106.426 96.8439 106.583 96.794C106.756 96.745 106.935 96.72 107.116 96.72C107.476 96.7166 107.834 96.7829 108.169 96.9153C108.473 97.0467 108.748 97.2366 108.979 97.4741C109.207 97.7222 109.384 98.0128 109.499 98.3293C109.623 98.677 109.685 99.0441 109.681 99.4134C109.682 99.7676 109.628 100.12 109.519 100.457C109.412 100.777 109.25 101.076 109.04 101.339C108.84 101.597 108.586 101.808 108.297 101.959C107.988 102.116 107.645 102.194 107.298 102.188C106.976 102.193 106.656 102.14 106.353 102.033C106.065 101.934 105.815 101.748 105.638 101.501V104.504H104.024V96.8614ZM105.509 99.4672C105.493 99.8177 105.614 100.161 105.847 100.423C105.971 100.547 106.12 100.644 106.284 100.706C106.448 100.769 106.623 100.797 106.799 100.787C106.974 100.798 107.15 100.771 107.314 100.708C107.478 100.646 107.627 100.548 107.75 100.423C107.968 100.152 108.087 99.8149 108.087 99.4672C108.087 99.1196 107.968 98.7823 107.75 98.5111C107.627 98.3861 107.478 98.2889 107.314 98.2262C107.15 98.1635 106.974 98.1366 106.799 98.1475C106.623 98.1379 106.448 98.1654 106.284 98.228C106.12 98.2907 105.971 98.3871 105.847 98.5111C105.728 98.6445 105.637 98.8001 105.579 98.9689C105.521 99.1376 105.497 99.3162 105.509 99.4942V99.4672Z"
        fill="#1C2544"
      />
      <path
        d="M114.21 98.208H112.786V99.9452C112.775 100.075 112.775 100.206 112.786 100.336C112.794 100.445 112.826 100.551 112.88 100.646C112.935 100.732 113.015 100.8 113.11 100.841C113.24 100.894 113.381 100.919 113.522 100.915C113.609 100.915 113.724 100.915 113.866 100.915C113.982 100.904 114.092 100.86 114.183 100.787V102.134C114.002 102.199 113.814 102.242 113.623 102.262C113.433 102.286 113.241 102.297 113.049 102.295C112.797 102.298 112.545 102.269 112.3 102.208C112.084 102.158 111.88 102.067 111.699 101.938C111.524 101.812 111.384 101.643 111.294 101.447C111.19 101.219 111.14 100.97 111.146 100.72V98.208H110.113V96.8613H111.146V95.3193H112.759V96.8613H114.183L114.21 98.208Z"
        fill="#1C2544"
      />
      <path
        d="M118.037 102.921C117.929 103.198 117.821 103.447 117.72 103.662C117.633 103.866 117.505 104.05 117.342 104.201C117.175 104.357 116.974 104.472 116.755 104.538C116.451 104.619 116.138 104.655 115.823 104.645C115.413 104.648 115.005 104.584 114.615 104.457L114.831 103.11C115.067 103.216 115.322 103.271 115.58 103.272C115.731 103.276 115.882 103.256 116.026 103.211C116.134 103.177 116.231 103.117 116.309 103.036C116.387 102.957 116.451 102.866 116.498 102.767L116.66 102.39L116.775 102.087L114.473 96.8613H116.215L117.565 100.302L118.719 96.8613H120.373L118.037 102.921Z"
        fill="#1C2544"
      />
    </SvgIcon>
  ) : (
    <SvgIcon viewBox="0 0 119 112" {...props}>
      <path
        d="M112.023 63.9276L91.3436 34.3002C90.9181 33.6894 90.3632 33.1933 89.7237 32.8518C89.0843 32.5103 88.3782 32.3329 87.6623 32.334H25.2181C24.5022 32.3329 23.7961 32.5103 23.1566 32.8518C22.5172 33.1933 21.9623 33.6894 21.5367 34.3002L0.857422 63.9276V100.033C0.857422 101.997 1.59302 103.881 2.90239 105.27C4.21176 106.659 5.98765 107.439 7.83938 107.439H105.054C106.905 107.439 108.681 106.659 109.991 105.27C111.3 103.881 112.036 101.997 112.036 100.033L112.023 63.9276Z"
        fill="#8B7CB6"
      />
      <path
        d="M105.054 108.1H7.8267C5.80663 108.1 3.8693 107.248 2.44089 105.733C1.01249 104.218 0.210018 102.162 0.210018 100.019V63.9279C0.208181 63.783 0.250473 63.6413 0.330613 63.5239L21.0099 33.8965C21.4967 33.2024 22.1294 32.6382 22.8577 32.249C23.586 31.8598 24.3899 31.6561 25.2054 31.6543H87.6495C88.4651 31.6561 89.269 31.8598 89.9973 32.249C90.7256 32.6382 91.3583 33.2024 91.8451 33.8965L112.524 63.5239C112.604 63.6413 112.647 63.783 112.645 63.9279V100.033C112.642 102.169 111.841 104.217 110.419 105.728C108.996 107.24 107.067 108.092 105.054 108.1ZM1.49216 64.1501V100.033C1.49216 101.819 2.16088 103.531 3.35122 104.794C4.54156 106.057 6.156 106.766 7.83939 106.766H105.054C106.737 106.766 108.352 106.057 109.542 104.794C110.732 103.531 111.401 101.819 111.401 100.033V64.1501L90.8486 34.6911C90.4804 34.1659 90.0018 33.7391 89.4509 33.4446C88.9 33.15 88.2919 32.9958 87.6749 32.9943H25.2181C24.6012 32.9958 23.9931 33.15 23.4422 33.4446C22.8913 33.7391 22.4127 34.1659 22.0445 34.6911L1.49216 64.1501Z"
        fill="#673AB7"
      />
      <path
        d="M112.023 63.9281V100.033C112.023 101.998 111.287 103.881 109.978 105.271C108.669 106.66 106.893 107.44 105.041 107.44H7.8267C5.97496 107.44 4.19907 106.66 2.8897 105.271C1.58032 103.881 0.844727 101.998 0.844727 100.033V63.9281H30.937L33.7679 78.7418C34.0241 80.0731 34.7061 81.2697 35.6986 82.1286C36.6911 82.9876 37.9329 83.4563 39.2138 83.4552H74.0221C75.3198 83.4541 76.5765 82.9725 77.5753 82.0936C78.5741 81.2147 79.2525 79.9935 79.4934 78.6408L82.1085 63.8877L112.023 63.9281Z"
        fill="#E5DEFF"
      />
      <path
        d="M25.2756 92.7272H12.8095C12.6412 92.7272 12.4797 92.6562 12.3607 92.5299C12.2417 92.4037 12.1748 92.2324 12.1748 92.0538C12.1748 91.8752 12.2417 91.7039 12.3607 91.5776C12.4797 91.4513 12.6412 91.3804 12.8095 91.3804H25.2756C25.4439 91.3804 25.6053 91.4513 25.7244 91.5776C25.8434 91.7039 25.9103 91.8752 25.9103 92.0538C25.9103 92.2324 25.8434 92.4037 25.7244 92.5299C25.6053 92.6562 25.4439 92.7272 25.2756 92.7272Z"
        fill="#673AB7"
      />
      <path
        d="M33.9076 23.4661C33.7116 23.465 33.5184 23.4158 33.3434 23.3224C33.1683 23.2289 33.016 23.0937 32.8983 22.9274L24.2597 10.8071C24.0569 10.5214 23.9693 10.1618 24.0163 9.80763C24.0634 9.45342 24.2411 9.13353 24.5104 8.91834C24.7798 8.70315 25.1187 8.61028 25.4526 8.66016C25.7864 8.71004 26.088 8.89858 26.2908 9.18431L34.9231 21.3046C35.1258 21.5895 35.2136 21.9481 35.1672 22.3017C35.1208 22.6552 34.9439 22.9747 34.6756 23.19C34.4549 23.3686 34.1851 23.4656 33.9076 23.4661Z"
        fill="#8672FF"
      />
      <path
        d="M74.8091 23.4659C74.5319 23.4631 74.2628 23.3663 74.0411 23.1899C73.7727 22.9746 73.5959 22.655 73.5495 22.3015C73.5031 21.948 73.5909 21.5894 73.7935 21.3045L82.4321 9.18417C82.6391 8.9118 82.9379 8.73555 83.2651 8.69274C83.5924 8.64993 83.9226 8.74391 84.1857 8.9548C84.4488 9.16568 84.6243 9.47691 84.6749 9.8226C84.7255 10.1683 84.6473 10.5213 84.4569 10.8069L75.8247 22.9273C75.7064 23.0945 75.5531 23.2303 75.3768 23.3238C75.2005 23.4173 75.0062 23.4659 74.8091 23.4659Z"
        fill="#8672FF"
      />
      <path
        d="M55.3549 19.4261C55.0182 19.4261 54.6953 19.2843 54.4573 19.0317C54.2192 18.7792 54.0854 18.4366 54.0854 18.0794V1.3467C54.0854 0.989533 54.2192 0.646994 54.4573 0.394438C54.6953 0.141883 55.0182 0 55.3549 0C55.6916 0 56.0145 0.141883 56.2526 0.394438C56.4906 0.646994 56.6244 0.989533 56.6244 1.3467V18.0794C56.6244 18.4366 56.4906 18.7792 56.2526 19.0317C56.0145 19.2843 55.6916 19.4261 55.3549 19.4261Z"
        fill="#8672FF"
      />
      <path
        d="M115.749 87.5825H79.1951C77.8315 87.5825 76.7261 88.7552 76.7261 90.2018V107.918C76.7261 109.364 77.8315 110.537 79.1951 110.537H115.749C117.112 110.537 118.218 109.364 118.218 107.918V90.2018C118.218 88.7552 117.112 87.5825 115.749 87.5825Z"
        fill="#FFC107"
      />
      <path
        d="M115.749 111.217H79.1951C78.3724 111.215 77.584 110.868 77.0022 110.251C76.4205 109.634 76.093 108.797 76.0913 107.924V90.2019C76.093 89.3291 76.4205 88.4927 77.0022 87.8755C77.584 87.2584 78.3724 86.911 79.1951 86.9092H115.749C116.571 86.911 117.36 87.2584 117.942 87.8755C118.523 88.4927 118.851 89.3291 118.853 90.2019V107.924C118.851 108.797 118.523 109.634 117.942 110.251C117.36 110.868 116.571 111.215 115.749 111.217ZM79.1951 88.2559C78.7086 88.2559 78.242 88.4609 77.898 88.8258C77.554 89.1908 77.3608 89.6857 77.3608 90.2019V107.924C77.3608 108.44 77.554 108.935 77.898 109.3C78.242 109.665 78.7086 109.87 79.1951 109.87H115.749C116.235 109.869 116.7 109.663 117.044 109.298C117.388 108.934 117.581 108.44 117.583 107.924V90.2019C117.581 89.6863 117.388 89.1924 117.044 88.8278C116.7 88.4632 116.235 88.2577 115.749 88.2559H79.1951Z"
        fill="#673AB7"
      />
      <path
        d="M82.978 94.5049H87.8399V96.0536H84.5521V97.4676H87.6558V99.0096H84.5521V100.558H88.0176V102.1H82.978V94.5049Z"
        fill="#212121"
      />
      <path
        d="M89.0903 96.8612H90.5502V97.5682C90.6014 97.4578 90.6701 97.3576 90.7533 97.272C90.8429 97.1652 90.9479 97.0743 91.0643 97.0026C91.1941 96.9204 91.3326 96.8548 91.4769 96.8073C91.6421 96.7578 91.813 96.7329 91.9847 96.7333C92.3019 96.727 92.6157 96.8033 92.8987 96.9555C93.1703 97.1139 93.3829 97.3656 93.5017 97.6692C93.6423 97.3684 93.863 97.1179 94.1364 96.9487C94.411 96.8139 94.709 96.7406 95.0115 96.7337C95.3141 96.7267 95.6147 96.7862 95.8946 96.9083C96.1073 97.0208 96.2905 97.1874 96.4278 97.3932C96.5663 97.6113 96.6633 97.856 96.7134 98.1136C96.7713 98.4036 96.799 98.6994 96.7959 98.9957V102.073H95.2789V99.0361C95.2835 98.8174 95.2331 98.6012 95.1329 98.4099C95.0774 98.3196 94.9994 98.2472 94.9076 98.2009C94.8157 98.1545 94.7136 98.136 94.6125 98.1473C94.4616 98.1424 94.3117 98.1747 94.1745 98.2416C94.0599 98.2959 93.9612 98.382 93.8889 98.4907C93.8167 98.6054 93.7651 98.7333 93.7365 98.8678C93.7051 99.0158 93.6902 99.1672 93.6921 99.319V102.073H92.1751V99.319C92.1751 99.2247 92.1751 99.1102 92.1751 98.9755C92.1687 98.842 92.143 98.7103 92.0989 98.585C92.0622 98.4641 91.994 98.3568 91.9022 98.2753C91.7863 98.186 91.6454 98.1409 91.5023 98.1473C91.339 98.1412 91.177 98.1807 91.0326 98.2618C90.9146 98.33 90.8176 98.4329 90.7533 98.5581C90.6875 98.6903 90.6445 98.834 90.6264 98.9823C90.6165 99.1482 90.6165 99.3146 90.6264 99.4806V102.073H89.1094L89.0903 96.8612Z"
        fill="#212121"
      />
      <path
        d="M98.0273 96.8613H99.4237V97.5346C99.4933 97.4306 99.5743 97.3356 99.6649 97.2518C99.766 97.1463 99.8816 97.0578 100.008 96.9892C100.143 96.9092 100.285 96.8438 100.433 96.7939C100.596 96.7448 100.765 96.7199 100.934 96.7199C101.273 96.7164 101.61 96.7828 101.925 96.9151C102.211 97.0466 102.469 97.2365 102.686 97.474C102.901 97.7221 103.067 98.0127 103.175 98.3292C103.292 98.6768 103.35 99.0439 103.346 99.4133C103.348 99.7675 103.296 100.12 103.194 100.457C103.094 100.777 102.941 101.075 102.743 101.339C102.555 101.596 102.317 101.808 102.045 101.959C101.755 102.115 101.432 102.194 101.106 102.187C100.803 102.192 100.502 102.14 100.217 102.033C99.9464 101.933 99.7113 101.748 99.5443 101.501V104.504H98.0273V96.8613ZM99.4237 99.4671C99.4081 99.8175 99.522 100.161 99.7411 100.423C99.8578 100.547 99.9978 100.644 100.152 100.706C100.306 100.769 100.471 100.796 100.636 100.787C100.801 100.798 100.966 100.771 101.121 100.708C101.275 100.645 101.415 100.548 101.531 100.423C101.736 100.152 101.848 99.8148 101.848 99.4671C101.848 99.1195 101.736 98.7822 101.531 98.511C101.415 98.3859 101.275 98.2888 101.121 98.2261C100.966 98.1633 100.801 98.1365 100.636 98.1474C100.471 98.1378 100.306 98.1652 100.152 98.2279C99.9978 98.2905 99.8578 98.387 99.7411 98.511C99.6295 98.6444 99.5439 98.8 99.4895 98.9687C99.435 99.1375 99.4126 99.3161 99.4237 99.4941V99.4671Z"
        fill="#212121"
      />
      <path
        d="M107.605 98.208H106.266V99.9453C106.256 100.075 106.256 100.206 106.266 100.336C106.273 100.445 106.304 100.551 106.355 100.646C106.407 100.732 106.482 100.8 106.571 100.841C106.693 100.894 106.825 100.919 106.958 100.915C107.04 100.915 107.148 100.915 107.282 100.915C107.391 100.904 107.495 100.86 107.58 100.787V102.134C107.41 102.199 107.233 102.242 107.053 102.262C106.874 102.286 106.694 102.297 106.514 102.295C106.276 102.299 106.039 102.269 105.809 102.208C105.606 102.158 105.414 102.067 105.244 101.938C105.08 101.812 104.948 101.643 104.863 101.447C104.766 101.219 104.718 100.97 104.724 100.72V98.208H103.753V96.8613H104.724V95.3193H106.241V96.8613H107.58L107.605 98.208Z"
        fill="#212121"
      />
      <path
        d="M111.204 102.921C111.103 103.198 111.001 103.447 110.906 103.662C110.824 103.866 110.703 104.05 110.551 104.201C110.394 104.357 110.205 104.472 109.998 104.538C109.713 104.619 109.418 104.655 109.122 104.645C108.737 104.648 108.353 104.584 107.986 104.457L108.189 103.11C108.411 103.216 108.651 103.271 108.894 103.272C109.036 103.276 109.177 103.256 109.313 103.211C109.414 103.177 109.506 103.117 109.579 103.036C109.652 102.957 109.712 102.866 109.757 102.767L109.91 102.39L110.017 102.087L107.853 96.8613H109.491L110.76 100.302L111.845 96.8613H113.401L111.204 102.921Z"
        fill="#212121"
      />
    </SvgIcon>
  );
}