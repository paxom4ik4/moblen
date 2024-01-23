import { Helmet } from 'react-helmet';

import './platform.css';

import complexly from './assets/complexly-drawn-rocket-launching-1200w-200h.png';
import ex2 from './assets/ex2-1100w.png';
import ex3 from './assets/ex3-600h.png';
import ex4 from './assets/ex4-1200w.png';
import moneyBag from './assets/money-bags-with-rubles---stocks-going-up-1-1200w-200h.png';
import pnglogtype from './assets/pnglogotype-1500h.png';
import websiteInterface from './assets/website-interface-200h.png';

import PastedIcon from './assets/pastedimage-yxbd.svg';

export const Platform = () => {
  return (
    <div className="home-container">
      <Helmet>
        <title>Moblen - Платформа</title>
        <meta
          property="og:title"
          content="Образовательный ассистент для педагогов нового поколения."
        />
      </Helmet>
      <section className="home-hero">
        <div className="home-menu">
          <div id="mobile-menu" className="home-mobile-navigation">
            <img alt="pastedImage" src={pnglogtype} className="home-logo" />
            <div className="home-links">
              <a href={'#benefits'}>
                <span className="Link">Выгоды</span>
              </a>
              <a href={'#possibility'}>
                <span className="Link">Возможности</span>
              </a>
              <a href={'#tarif'}>
                <span className="Link">Тарифы</span>
              </a>
              <a href={'#pilot'}>
                <span className="Link">Пилот</span>
              </a>
            </div>
            <div id="close-mobile-menu" className="home-close-mobile-menu">
              <svg viewBox="0 0 804.5714285714286 1024" className="home-icon">
                <path d="M741.714 755.429c0 14.286-5.714 28.571-16 38.857l-77.714 77.714c-10.286 10.286-24.571 16-38.857 16s-28.571-5.714-38.857-16l-168-168-168 168c-10.286 10.286-24.571 16-38.857 16s-28.571-5.714-38.857-16l-77.714-77.714c-10.286-10.286-16-24.571-16-38.857s5.714-28.571 16-38.857l168-168-168-168c-10.286-10.286-16-24.571-16-38.857s5.714-28.571 16-38.857l77.714-77.714c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 16l168 168 168-168c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 16l77.714 77.714c10.286 10.286 16 24.571 16 38.857s-5.714 28.571-16 38.857l-168 168 168 168c10.286 10.286 16 24.571 16 38.857z"></path>
              </svg>
            </div>
          </div>
          <div className="home-desktop-navigation">
            <nav className="home-centered">
              <div className="home-left">
                <img alt="pnglogotype" src={pnglogtype} className="home-logo1" />
                <div className="home-links1">
                  <a href={'#benefits'}>
                    <span className="home-text004 Link">Выгоды</span>
                  </a>
                  <a href={'#possibility'}>
                    <span className="home-text005 Link">Демонстрация</span>
                  </a>
                  <a href={'#tarif'}>
                    <span className="home-text006 Link">Цены</span>
                  </a>
                  <a href={'#pilot'}>
                    <span className="home-text007 Link">Пилотная версия</span>
                  </a>
                </div>
              </div>
              <div className="home-right">
                <div className="home-get-started">
                  <span className="home-text008">Попробовать</span>
                </div>
                <div id="open-mobile-menu" className="home-burger-menu">
                  <PastedIcon />
                </div>
              </div>
            </nav>
          </div>
          <div>
            <div className="home-container02"></div>
          </div>
        </div>
        <header className="home-header">
          <h1 className="home-text009">
            <span className="home-text010">Moblen</span>
            <br></br>
            <span className="home-text012">Образовательные технологии нового поколения</span>
          </h1>
          <p className="home-text013">
            Передовой образовательный ассистент, создающий и проверяющий домашние задания, тесты и
            контрольные для ваших курсов
          </p>
          <div className="home-get-started1">
            <span className="home-text014">Начать</span>
          </div>
        </header>
      </section>
      <section className="home-features" id={'benefits'}>
        <div className="home-container03">
          <div className="home-container04">
            <div className="home-image-container">
              <img alt="Ex1" src={complexly} className="home-cards-image" />
            </div>
            <div className="home-left1">
              <span className="home-text015 title">
                <span>Экономим</span>
                <br></br>
                <span>время</span>
                <br></br>
              </span>
              <span className="home-text020">
                Отложите рутину. Занимайтесь только тем, что считаете по-настоящему важным.
              </span>
            </div>
          </div>
          <div className="home-container05">
            <div className="home-image-container1">
              <img alt="Ex1" src={websiteInterface} className="home-cards-image1" />
            </div>
            <div className="home-left2">
              <span className="home-text021 title">Встраиваемся в процесс</span>
              <span className="home-text022">
                Не ломаем то, что работает. При помощи API интегрируйте Moblen туда, где уже
                находятся ваши педагоги.
              </span>
            </div>
          </div>
          <div className="home-container06">
            <div className="home-image-container2">
              <img alt="Ex1" src={moneyBag} className="home-cards-image2" />
            </div>
            <div className="home-left3">
              <span className="home-text023 title">
                <span>Снижаем</span>
                <br></br>
                <span>издержки</span>
              </span>
              <span className="home-text027">
                Никаких лишних трат. Мы делаем вашу текущую работу дешевле, быстрее и качественнее.
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="home-banners" id={'possibility'}>
        <div className="home-banner-manage">
          <div className="home-container07">
            <div className="home-left4">
              <span className="home-text028 sub-title">Генерация заданий</span>
              <h2 className="home-text029 title">Генерируйте задания по любым темам</h2>
              <span className="home-text030">
                <span className="home-text031">
                  От бизнес-аналитики и русской литературы, до микробиологии и иностранных языков.
                </span>
                <span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
                <br></br>
              </span>
              <div className="home-get-started2 template-button">
                <span className="home-text034">Попробовать</span>
              </div>
            </div>
            <div className="home-image-container3">
              <img alt="Ex1" src={ex4} className="home-cards-image3" />
            </div>
          </div>
        </div>
        <div className="home-banner-advanced-analytics">
          <div className="home-centered-container">
            <div className="home-image-container4">
              <img alt="ex2" src={ex2} className="home-cards-image4" />
            </div>
            <div className="home-right1">
              <span className="home-text035 sub-title">Ускорение проверки</span>
              <h2 className="home-text036 title">
                <span>Пользуйтесь</span>
                <br></br>
                <span>продвинутым</span>
                <br></br>
                <span>оцениванием и</span>
                <span> аналитикой</span>
              </h2>
              <div className="home-category">
                <span className="home-text043">Оценивание</span>
                <span className="home-text044">
                  При генерации Moblen сам задает критерии, которые можно редактировать. Ответ
                  оценивается по критерию, с учетом ваших запросов.
                </span>
              </div>
              <div className="home-category1">
                <span className="home-text045">Аналитика</span>
                <span className="home-text046">
                  В открытых заданиях Moblen дает ученикам аналитику по их ответу: недостатки, пути
                  улучшения ответа и фактические ошибки
                </span>
                <div className="home-get-started3 template-button">
                  <span className="home-text047">Узнать больше</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="home-banner">
          <div className="home-container08">
            <div className="home-left5">
              <span className="home-text048">Единая система</span>
              <h2 className="home-text049 title">
                Организуйте курсы и обучайте группы учеников в одном месте
              </h2>
              <span className="home-text050">
                Для тех, у кого нет своей платформы. В Moblen-LMS можно добавлять учеников,
                создавать и структурировать группы и курсы, следить за успеваемостью
              </span>
              <div className="home-get-started4 template-button">
                <span className="home-text051">Начать</span>
              </div>
            </div>
            <div className="home-image-container5">
              <img alt="ex3" src={ex3} className="home-cards-image5" />
            </div>
          </div>
        </div>
      </section>
      <div className="home-banner1">
        <div className="home-left6">
          <span className="home-text052">Демонстрация</span>
          <h2 className="home-text053 title">Как это работает?</h2>
          <div className="home-separator"></div>
          <nav className="home-nav">
            <nav className="home-nav1">
              <div className="home-get-started5 template-button">
                <span className="home-text054">Проверка</span>
              </div>
              <div className="home-get-started6 template-button">
                <span className="home-text055">Генерация</span>
              </div>
            </nav>
          </nav>
        </div>
        <div className="home-container09">
          <video
            src={''}
            loop={true}
            muted={true}
            poster="https://play.teleporthq.io/static/svg/videoposter.svg"
            preload="auto"
            autoPlay={true}
            className="home-video"></video>
        </div>
      </div>
      <div className="home-pricing" id={'tarif'}>
        <div className="home-container10">
          <span className="home-text056 title">Цены использования</span>
          <span className="home-text057 title">
            <span>Чем больше средств вы переведете на счет</span>
            <br></br>
            <span>в личном кабинете, тем ниже будут цены.</span>
          </span>
          <div className="home-container11">
            <div className="home-pricing-card">
              <span className="home-text061">БЕСПЛАТНОЕ DEMO</span>
              <div className="home-container12">
                <span className="home-text062">
                  <span>₽</span>
                  <br></br>
                </span>
                <span className="home-text065">15</span>
                <span className="home-text066">/ проверка</span>
              </div>
              <div className="home-container13">
                <span className="home-text067">
                  <span>₽</span>
                  <br></br>
                </span>
                <span className="home-text070">15</span>
                <span className="home-text071">/ генерация(в среднем)*</span>
              </div>
              <span className="home-text072">
                На баланс начисляется 1000 рублей, которые можно потратить на генерацию и проверку с
                указанными ценами.
              </span>
              <div className="home-container14">
                <span className="home-text073">✔ Старт с 1000₽ на счете</span>
                <span className="home-text074">✔ 12 форматов</span>
                <span className="home-text075">✔ Создание курсов и групп</span>
              </div>
              <button className="home-button button">Попробовать</button>
            </div>
            <div className="home-pricing-card1">
              <span className="home-text076">ЛУЧШИЙ ПОМОЩНИК</span>
              <div className="home-container15">
                <span className="home-text077">
                  <span>₽</span>
                  <br></br>
                </span>
                <span className="home-text080">6</span>
                <span className="home-text081">/ проверка</span>
              </div>
              <div className="home-container16">
                <span className="home-text082">
                  <span>₽</span>
                  <br></br>
                </span>
                <span className="home-text085">7</span>
                <span className="home-text086">/ генерация(в среднем)*</span>
              </div>
              <span className="home-text087">Баланс &gt;50.000 рублей за всё время</span>
              <div className="home-container17">
                <span className="home-text088">✔ Наибольшая выгода</span>
                <span className="home-text089">✔ Подходит для курсов и организаций</span>
                <span className="home-text090">✔ Поддержка 24/7</span>
                <span className="home-text091">✔ Полный функционал</span>
              </div>
              <button className="home-button1 button">Подключить</button>
            </div>
            <div className="home-pricing-card2">
              <span className="home-text092">ПРОСТОЙ АССИСТЕНТ</span>
              <div className="home-container18">
                <span className="home-text093">
                  <span>₽</span>
                  <br></br>
                </span>
                <span className="home-text096">8</span>
                <span className="home-text097">/ проверка</span>
              </div>
              <div className="home-container19">
                <span className="home-text098">
                  <span>₽</span>
                  <br></br>
                </span>
                <span className="home-text101">9</span>
                <span className="home-text102">/ генерация (в среднем)*</span>
              </div>
              <span className="home-text103">Баланс &lt;50.000 рублей за всё время</span>
              <div className="home-container20">
                <span className="home-text104">✔ Стандартный план</span>
                <span className="home-text105">✔ Лучший для репетиторов</span>
              </div>
              <button className="home-button2 button">Подключить</button>
            </div>
          </div>
          <span className="home-text106 title">
            *Генерация нескольких заданий за один запрос значительно снижает издержки
          </span>
        </div>
      </div>
      <div className="home-banner2" id={'pilot'}>
        <div className="home-left7">
          <span className="home-text107">Сотрудничество</span>
          <h2 className="home-text108 title">Оставьте заявку</h2>
        </div>
      </div>
      <div className="home-testimonial">
        <div className="home-container21">
          <h1 className="home-text109">
            <span>Команда</span>
            <br></br>
          </h1>
          <span className="home-text112">
            Наш интерес выходит далеко за рамки прибыли - при помощи нашего проекта мы стремимся
            раскрыть новые горизонты в образовании.
          </span>
          <div className="home-container22">
            <div className="home-container23">
              <div className="home-testimonial-card">
                <div className="home-testimonial1">
                  <span className="home-text113">Владислав Кудинов</span>
                  <span className="home-text114">
                    Руководитель проекта, специалист по машинному обучению, аналитик
                  </span>
                </div>
              </div>
              <div className="home-testimonial-card1">
                <div className="home-testimonial2">
                  <span className="home-text115">Павел Зеленко</span>
                  <span className="home-text116">Frontend-разработчик</span>
                </div>
              </div>
              <div className="home-testimonial-card2">
                <div className="home-testimonial3">
                  <span className="home-text117">Сергей Гузенко</span>
                  <span className="home-text118">
                    Специалист по машинному обучению, BACKEND-разработчик
                  </span>
                </div>
              </div>
            </div>
            <div className="home-container24">
              <div className="home-testimonial-card3">
                <div className="home-testimonial4">
                  <span className="home-text119">Драгомир Коробко</span>
                  <span className="home-text120">
                    Дизайнер, инженер пользовательского опыта, Специалист по машинному обучению
                  </span>
                </div>
              </div>
              <div className="home-testimonial-card4">
                <div className="home-testimonial5">
                  <span className="home-text121">Артём Тарасов</span>
                  <span className="home-text122">BAckend-разработчик</span>
                </div>
              </div>
              <div className="home-testimonial-card5">
                <div className="home-testimonial6">
                  <span className="home-text123">Александр Прокофьев</span>
                  <span className="home-text124">МАРКЕТОЛОГ, АНАЛИТИК</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="home-footer">
        <div className="home-top">
          <div className="home-right2">
            <div className="home-category2">
              <span className="home-text125">Связь</span>
              <div className="home-links2">
                <span className="home-text126">partnership@moblen.ru</span>
                <span className="home-text127">+79087856734</span>
                <span className="home-text128">t.me/fatherjones</span>
                <span className="home-text129">
                  <span>vk.com/a1122</span>
                  <br></br>
                </span>
              </div>
            </div>
            <div className="home-category3">
              <span className="home-text132">Moblen</span>
              <div className="home-links3">
                <span className="home-text133">Выгоды</span>
                <span className="home-text134">Демонстрация</span>
                <span className="home-text135">Цены</span>
                <span className="home-text136">Пилотная версия</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
