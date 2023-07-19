import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => {
  return {
    img: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transformOrigin: "center",
      "&.loading": {
        animation: `$loading 1000ms`,
        animationIterationCount: "infinite",
      },
    },
    "@keyframes loading": {
      "0%": {
        transform: "rotate(0deg)",
      },
      "100%": {
        transform: "rotate(360deg)",
      },
    },
  };
});

export default function NFIDIcon({ loading }: { loading?: boolean }) {
  const classes = useStyles();

  return (
    <Box className={`${classes.img}${loading ? " loading" : ""}`} sx={{ width: "42px", height: "42px" }}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <rect width="40" height="40" rx="20" fill="url(#pattern0)" />
        <defs>
          <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image0_30488_80146" transform="scale(0.0104167)" />
          </pattern>
          <image
            id="image0_30488_80146"
            width="96"
            height="96"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAIAAABt+uBvAAAK22lDQ1BJQ0MgUHJvZmlsZQAASImVlwdUU1kagO976SGhBSIgJfSOdAJICT303kQlJIGEEkJCQBEVlcERHAsqIqgoOiKi4OgIyFgQC7ZBsWGfIIOCug4WbKjZF1jCzOzZ3bN/zs398r///uW+e8/5AwA5hCUU5sKqAOQJCkWxwX605JRUGu4pgIAWoCIfUxZbLGRER4cDRKbnv8r7O4g1Ijdt5b7+/fl/FXUOV8wGAEpDOIMjZuch3I2M52yhqBAA1EFEb1xcKJTzdYQ1REiCCP8u56wp/ijnjElGkyZt4mP9EaYBgCexWKIsAEg2iJ5WxM5C/JDkNdgLOHwBwqUIe7N5LA7CJxC2ycvLl/MIwhaIvRAAMrI7gJ7xJ59Zf/GfofDPYmUpeKquScEH8MXCXNbi/3Nr/rfk5UqmY5ghg8QThcTK4yH7dzcnP0zBgozIqGnmc6ZykjNPEpIwzWyxf+o0c1gBYYq1uZHh05zJD2Iq/BQy46eZKw6Mm2ZRfqwiVqbInzHNLNFkXCLCUklOgkLP4zIV/kt48UnTXMRPjJxmcU5c2IyNv0IvksQq8ucKgv1m4gYpas8T/6lePlOxtpAXH6KonTWTP1fAmPEpTlbkxuEGBM7YJCjshYV+iljC3GiFPTc3WKEXF8Up1hYih3NmbbRiD7NZodHTDPggArAAm6YyTQAUchcVygvxzxcuFvGzeIU0BnLbuDSmgG1nQ3O0d3QEQH53p47DW+rknYSol2d0q4IAmNsmk8m+zOjCkHN8pAB5LedndBZIDapSAC7msCWioikdWv6FQd6eCtAA2kAfGAMLYAscgSvwBL4gEISCKBAPUsACJFceyAMiUAxKwQpQAarABrAF1IEGsAfsB4fAEdABToAz4AK4Aq6D2+ABkIJh8AKMgfdgAoIgHESGKJA2ZACZQtaQI0SHvKFAKByKhVKgdCgLEkASqBRaBVVB1VAdtBtqhn6CjkNnoEtQP3QPGoRGoTfQZxgFk2ANWA82g+fAdJgBh8Hx8Hw4Cy6AS+ByeB1cCzfCB+F2+Ax8Bb4NS+EX8DgKoJRQVJQhyhZFR/mjolCpqEyUCLUMVYmqQTWiWlFdqF7UTZQU9RL1CY1FU9A0tC3aEx2CTkCz0QXoZei16Dr0fnQ7+hz6JnoQPYb+hiFjdDHWGA8ME5OMycIUYyowNZh9mGOY85jbmGHMeywWS8WaY92wIdgUbDZ2CXYtdge2DduN7ccOYcdxOJw2zhrnhYvCsXCFuArcNtxB3GncDdww7iNeCW+Ad8QH4VPxAvxKfA3+AP4U/gb+GX6CoEowJXgQoggcwmLCesJeQhfhGmGYMEFUI5oTvYjxxGziCmItsZV4nviQ+FZJSclIyV0pRomvVKZUq3RY6aLSoNInkjrJiuRPSiNJSOtITaRu0j3SWzKZbEb2JaeSC8nryM3ks+TH5I/KFGU7ZaYyR3m5cr1yu/IN5VcqBBVTFYbKApUSlRqVoyrXVF6qElTNVP1VWarLVOtVj6sOqI6rUdQc1KLU8tTWqh1Qu6Q2oo5TN1MPVOeol6vvUT+rPkRBUYwp/hQ2ZRVlL+U8ZVgDq2GuwdTI1qjSOKTRpzGmqa7prJmouUizXvOkppSKoppRmdRc6nrqEeod6udZerMYs7iz1sxqnXVj1get2Vq+WlytSq02rdtan7Vp2oHaOdobtTu0H+mgdax0YnSKdXbqnNd5OVtjtuds9uzK2Udm39eFda10Y3WX6O7Rvao7rqevF6wn1Numd1bvpT5V31c/W3+z/in9UQOKgbcB32CzwWmD5zRNGoOWS6ulnaONGeoahhhKDHcb9hlOGJkbJRitNGozemRMNKYbZxpvNu4xHjMxMIkwKTVpMblvSjClm/JMt5r2mn4wMzdLMltt1mE2Yq5lzjQvMW8xf2hBtvCxKLBotLhlibWkW+ZY7rC8bgVbuVjxrOqtrlnD1q7WfOsd1v02GBt3G4FNo82ALcmWYVtk22I7aEe1C7dbaddh92qOyZzUORvn9M75Zu9in2u/1/6Bg7pDqMNKhy6HN45WjmzHesdbTmSnIKflTp1Or52tnbnOO53vulBcIlxWu/S4fHV1cxW5trqOupm4pbttdxuga9Cj6WvpF90x7n7uy91PuH/ycPUo9Dji8YenrWeO5wHPkbnmc7lz984d8jLyYnnt9pJ607zTvXd5S30MfVg+jT5PfI19Ob77fJ8xLBnZjIOMV372fiK/Y34f/D38l/p3B6ACggMqA/oC1QMTAusCHwcZBWUFtQSNBbsELwnuDsGEhIVsDBlg6jHZzGbmWKhb6NLQc2GksLiwurAn4VbhovCuCDgiNGJTxMNI00hBZEcUiGJGbYp6FG0eXRD9Sww2JjqmPuZprENsaWxvHCVuYdyBuPfxfvHr4x8kWCRIEnoSVRLTEpsTPyQFJFUnSZPnJC9NvpKik8JP6UzFpSam7ksdnxc4b8u84TSXtIq0O/PN5y+af2mBzoLcBScXqixkLTyajklPSj+Q/oUVxWpkjWcwM7ZnjLH92VvZLzi+nM2cUa4Xt5r7LNMrszpzJMsra1PWKM+HV8N7yffn1/FfZ4dkN2R/yInKacqR5SbltuXh89LzjgvUBTmCc/n6+Yvy+4XWwgqhtMCjYEvBmChMtE8MieeLOws1kCbpqsRC8p1ksMi7qL7oY3Fi8dFFaosEi64utlq8ZvGzkqCSH5egl7CX9JQalq4oHVzKWLp7GbQsY1nPcuPl5cuHy4LL9q8grshZ8etK+5XVK9+tSlrVVa5XXlY+9F3wdy0VyhWiioHVnqsbvkd/z/++b43Tmm1rvlVyKi9X2VfVVH1Zy157+QeHH2p/kK3LXNe33nX9zg3YDYINdzb6bNxfrVZdUj20KWJT+2ba5srN77Ys3HKpxrmmYStxq2SrtDa8tnObybYN277U8epu1/vVt23X3b5m+4cdnB03dvrubG3Qa6hq+LyLv+vu7uDd7Y1mjTV7sHuK9jzdm7i390f6j837dPZV7fvaJGiS7o/df67Zrbn5gO6B9S1wi6Rl9GDaweuHAg51ttq27m6jtlUdBoclh5//lP7TnSNhR3qO0o+2/mz68/ZjlGOV7VD74vaxDl6HtDOls/946PGeLs+uY7/Y/dJ0wvBE/UnNk+tPEU+Vn5KdLjk93i3sfnkm68xQz8KeB2eTz946F3Ou73zY+YsXgi6c7WX0nr7odfHEJY9Lxy/TL3dccb3SftXl6rFfXX491ufa137N7VrndffrXf1z+0/d8Llx5mbAzQu3mLeu3I683X8n4c7dgbQB6V3O3ZF7ufde3y+6P/Gg7CHmYeUj1Uc1j3UfN/5m+Vub1FV6cjBg8OqTuCcPhthDL34X//5luPwp+WnNM4NnzSOOIydGg0avP5/3fPiF8MXEy4p/qP1j+yuLVz//4fvH1bHkseHXoteyN2vfar9teuf8rmc8evzx+7z3Ex8qP2p/3P+J/qn3c9LnZxPFX3Bfar9afu36FvbtoSxPJhOyRKzJVgCFDDgzE4A3TUhvnAIABenLifOmeutJgab+D0wS+E881X9PiisArWUAxMi7m24ADiPDDPmt4guAvCWK9wWwk5Ni/EvEmU6OU75ISGeJ+SiTvdUDANcFwFeRTDaxQyb7uhdJ9h4A3QVTPb1csEgvv8sxoNjSq7+pqwz8Tab6/T/V+PcZyDNwBn+f/wlnuhu9O/9ijgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAYKADAAQAAAABAAAAYAAAAACK+310AAAM40lEQVR4Ae2cbYxcVRnHz8u987K7Mzu73XZbaKmAFFqEFiRiYoogKmhIY1CsHzSY+AUxIaZGY0JCYvAl8YP6AUyMfjDBiBhJDMRgEI2N0bQ0Si0WUKQtpd3dtrPvs7Mz9+34f869s3N3u7u3Z3Yv2zV3cnP3zD1n7j3nN//nOed57p3lSimWvZYmIJauymqIQAYoQQcZoAxQAoGE6kxBGaAEAgnVmYIyQAkEEqozBWWAEggkVGcKygAlEEiozhSUAUogkFCdKSgDlEAgodpKqL+0amTd/Lrya7476XtTtHeqrlP1mqOekHzbgwPFrblLO5NZq/qQe/JXE426svptu98qbLRyFStf5oVekevh+S5udrrFWq8UkDftTx+fHTtcm/lv05v0F81PVl+a2vbFgcWuvtJjbz83NfzPpseFywKXuy4VBN76UuT67N5tcsft8uobZb6r8wt1Dggspo7Wz/xytDHiLn/9/ObOr7L8mXObcw53HC48JufoUCEQU6N8eJy9ekz1Xanu+hTfuXv5My1Zyxf9zpdsHqu48Mepd35RVV47pc0ll0Uu8sLqlfkBKzdg2xWZ32hX3t/NVkHssWu3ioGrzh1zaqPBzISaHGVT42pijNcdXm+IphIgReLiTBTZvv3sAx/spBMdApo8Wn/rh8MqoJ6CSPmm4oY7Sl1X5WVRiALnopOutEa9or/okuuoRp2dPaWOvsyPHWMOV65gnlCPfEXcsMO4Y50ACmbV8W+edsY8DMXuta5+eLC0q7CiYaX24df+xZ562h+rEaO+Afa9b1g52+xinayDxg5Nh3RETrzny5suWzogset97IHPCtbFmiI4MxkcPq41b4KoE0ATf58JL9F7a1f5xqLJ5dag7a27+Z7drClVQ6gXXyHVG72MAQWNoHEhmrYqe1Ywfxp1c2WNd14vAAjbq8O+6ZmMAXm1wDlP3wPmrJ4dl6nrWUDhqi2cFZgjg6qjJurtaXdBs0XfGgNqjjjh1G73SdktFz3p5XZwoIz1h2pARCJ4e8zMDRkDamj5AIFdsUTeeNZcE3blLmbDT0vlSPX2RMqA3Grk56weAStbkwF3cNFSCRMZuaHzs2aAjIMAdzryc3Z5fdhXSLO7xByhXKkuNMx8UOeArNJ6AlTuYU2bBRavJgSOC9VpCEixoB5JFHHWwpNdxu8HKyLIcQA655j10thJW6XoI8Wr8maXWtPWt2yxVIH7ed5VNPObxrGYc8Gt/qWW32ht2Fta0yGbXdwP2LMnvBPT6ks3yI1FA1kYAzLr1/pvbcBy/Q+2kxEYOmnDS4w8Nz5+ZEYx7mFDJpT2fNtHS1v3RiFu4LM//3R27DzzKFUatqGCy7nPlccpj4O9b6lckVX62eZNbMsmfu1WjsWxYV86bJ4uICTtp08585KhXPTH17KKjVbZ0GmiACguIzTI3bigg2ULcl2SUjlUwNuTtPcEw6Jm1zV8/4fsnVeItHNz6QLymXC41DljSoBSDpQJn7ftGos2h6EBEFC+PaKjKRCRkBEVGKHhCos9T7LarDrzunrxTffePdbDd+Q3lVJUU7uvHUpw2Y/BrBoESDb1BhYowNziHwIatKEGEkmJKCBoyABhQUMEFGHShrdBw1KOReWGRbU1rp5+1fnkz2tvVI2TGPEOLF9OGxAHHT1+S2OymtyCrOJ9Cqk1BQMOYqEHr+kAB0WYtFEYReyQ9MIeOgoJgtd5T+37zexro2YRVrwDy5fTNTEYFKTRMh+yL5R9Pl9BApmalrshp0Mep1TBvYCWkxas5rGReoD0OxxQyzGRrSmL+xavcfbQweYL+4rdKYwmhVPGvhGYWJPBpuCJIjp0Y2+BggRJI/I4UYEd2G/fMv8OxIzDjpzyfn3UfemE60nlWVxJHtgAxJQtXq+rH73mPnqzYUY+1tWlivPUvlSjjo+TggSZWGRH2h/NUxDcc+RitClRGWYVKL4w5u7OsTt3WE88UHziM12yiwIrxA0+wqu8wB7bj0/508YZ5+SRpQxIKwh+J3LD5I+suIJoFiOHwnS6j1wMnAv2S3kUTOoff6/17bsLAdERESNgyolpKZ4eWupzySCWapEyIMb1/EWeqLXRCjDeGwCCG3bIQ5OTxlu4pAVt4u1Rvn+HfdtWi+Rjaym11PT7yXlnXvCpzt6mDAgKaqORTcGBAGvC+AveB6liKEjP6Hoik0rNbxNvj7It2P3XWSQfBOikI1gZ7f82u+zHFpzl0t6m7KS1gvQTF3p9rH2wT6NojyRUENbNKISuGgSD+Sq7eCzXVwQDF4tyYLTZtK9KXgtYz6p+6ekCcmllyCi2ag0ek7Q/PzqIA9LhBS2aE1d+5Ty3CrBfBjTKEgFIUYEhnbeeAAGNnsIDGrkOFwBoMROjyAukdDNqGbQVdrF66IijWBM+SGj50EzPmYTpBRJ/VvWVroJo2NrvIoyKAEEdMfMJZzHc0purJflIrpLMZMhlzdC4sCCymJBYM8Jl+2W5rgBh2Jiz5+wr1JEv5s01WDrDPYeAsAIEHXiTmI9aXA9H6gyOGS25pZfTKIpgZ4GUtLqv1BWEaSsEFNK52MRCH6SF0/K4EMV8P7VgzKMe+8kYUzkmYFPw1EBKgPyPpRBrpAyIY40TmQ8B0qFW3MQwcr0CUnqU2qGQr13OxLBa3neSnWdMStAhLqATYvp0afWfFUgZkF4EkoIQUrR8MEjFFYGYk5Z8oUPRszXKan5AO9f+0Aw7MKwON5kt8aAmUaW9tq/bCmJPYfWHs/pnnBsMCpiwyMS0h9YmRlOVXge1W1HASd4E9iXgbn3N6A/V4IzPaLkoAAsRPMODKwfr7K+zOKiwKoyEg1gV8tHu+Wt9qWRh0wUENPFIHbxIR7FZDJw0oJb30WsZKOjJd4JgBAepNhKXxfVUFeklBIS99un+VyvFDxdTeRQ7XUA+Uhmhk46JCAfbLyTkSUEESE/UkRvSUHS6J3RJFoscDaTGYVy6nh6HpsJ93fYjlZ72OVe1lC4g6AVxlkMPmUI75K0xkQcxQPBGOuBUWiza0FqSwYwdYiLhaDsivWhA2umQA+qz2OdKha/3ppiUThcQ/A7yO+SktYf2tD3AZ8S/47aJgUgLCqmJNIWpSrUmcm1NISPh90p2a946UOnenUvFsuZ6mDIgTvkdLRymfWk07LnLo0CA8toHaWuCxWk6DPc+LAlKodMBHT8ngz7JrsmJu4q5u4u5m/Ornz+Mdywsp3vr+fiwf2oioMCK05SkKAzgN28UV5cjM/MVOzga0BPXAg1owqIlIsrR9EXHMI/hQEGwAcmvtOSgfFefU08X0MVfyLo7Ymxi1TF26FjQ38duv0nImLu9zEeumDro1IYC5yO58mZhYJvGgJ563jt0PECm/TsVe+f2dUPoZbf+rdoQ1p4nfefR7i2X/nWajRD/rWp0ltZ+2P6TQob80vtt2vItvwk6+NR4YHbrw0xBiJC68LioTvGcx1Mb6+d1PoieTdwgzIZs1hpAij1I32DmVlXD52nXFuaFlnAq3GzIZq0xyB48LqqjB9PnadcW0BSeRNKvijBLOZr5IFxiQy+lmbEN1X1v9e/TpYVxTEWup4+nDOjKDRxpZojozGxQQ+p8PbwmlT/dulGyVZqFJsYKurKfOzYBGmqqccOn1tcK5jnfm9F3s7Gk3542oHKBb6jQvfCmLY4b/nJmrQCNKMfV/0+zj1ultE2slOO7wvviOf7i2cQbfGvFpH3dgKnDbvQTyW2G8sFZjE0MS6G92/V98Rz/7XBwqHq5O+p/uLMvNCZDYPfky21yl1YyBoTT3neNtbkikWmflvzho96h8cuX0TGv/v2ZYU+voQeFfU+u99KwtFt1GM0/f8Z/8IhHKSzEfRb/wna5f5Bf38UrFivMS4e1r/TulDCtNpSaUf5pv/m75uSf8Ost7X3yXDzWc8Ve2zgz2yEgjPbJE8HjJ/wpjhxYmFoXyO2Vc6zfVtfmg+05tT3HNkq21WZ7i1Z+ids4K6TmKfWKVz/ru+PKQzAxEnjnfPiboK6CZuwhLNA50DX4ibyxfNC9zgHhw8+cCx47jfg4Sh7zdvKY7ueF+WM8UPDdgeLnS6n8evyp2dGfzV5YfjF2hbAf6tp0Z67Dn94Yhxrx73z/oLi7nz07wZ6ZVG94ajygxChl1MMbD3TDk8r/9hAopgLoLQgl3qFYuSzkdbJwb673NrvLNECNnWZlCpo7EXp5wVOjgTrnoRCc9f1h3xvxfSi/R6jH+3qvtVf0TcxdaEHhTb/xgxn8RE5tFNYgtzcLa0Da/VxukBZ+6IyoIvkpiAVnvOjtikzsorP9Hx7oZJr/P8Sw9JAyQEuz0TUZoAxQAoGE6kxBGaAEAgnVmYIyQAkEEqozBWWAEggkVGcKygAlEEiozhSUAOh/0wBjN13MCjcAAAAASUVORK5CYII="
          />
        </defs>
      </svg>
    </Box>
  );
}