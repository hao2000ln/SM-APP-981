---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.7.5.8 .. 1.7.5.8
printed_pages: 2194-2228
---

# 1.7.5.8 Configure rule sets and actions

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.5.8. Configure rule sets and actions

Rule sets enforce business logic in elements such as phases or transitions, for
example checking if the user has filled in the required data or has the proper security
level to perform a transition.
Actions perform a task for a phase, and refer to rule sets that are marked as "Available
as Action."


1.7.5.8.1. Configure rule sets at various
levels

You can configure rule sets in workflows at the following levels:

     At the phase level (only applies to the current phase)
     At the workflow level (applies to all phases in the workflow)
     At the object level (applies to all workflows of the object)

If you expect that a rule set will only be triggered at a specific phase, configure the
rule set at the phase level. If you expect that a rule set will be triggered in all the
phases of a workflow, configure the rule set at the workflow level. If you expect that a
rule set will be triggered in all workflows that are associated with a specific object,
configure the workflow at the object level. For example, you can move business logic
that you have implemented in triggers to object-based rule sets.

            Note

           If a call bypasses the Document Engine, the triggers are still invoked, but
           the rule sets at various levels aren't invoked.

Rule set are executed in the following order:

   1. Object level
   2. Workflow level
   3. Phase level

For more information, see Consider rule set execution order.


1.7.5.8.2. Configure rule sets at various
triggering events

Following is the typical usages:


Triggeri Triggeri                       Typical  Typical      Phase  Workflo Object
ng event ng                             usage    configur     level  w level level
                                                 ed rule
             action                              type

On add Runs                             Set      Set                 Yes  Yes

immedia                                 the      Fiel

tely                                    rec      d

before                                  ord      fro

the                                     ID       m

record is                               if       Nu

added to                                del      mb

the                                     ayi      er

databas                                 ng       rul

e                                       ass      e

                                        igni     Set

                                        ng       Fiel

                                        rec      d

                                        ord      rul

                                        nu       e

                                        mb       As

                                        er       sig

                                        Set      nm

                                        def      ent

                                        ault     rul

                                        fiel     e

                                        d        Ma

                                        val      nd

                                        ues      ato

                                        if       ry

                                        the      ch

                                        y        eck

                                        are      :

                                        em                 S

                                        pty                e

                                        Aut                t

                                        om                 M

                                        atic               a

                                        ally               n


Triggeri Triggeri                       Typical    Typical   Phase  Workflo Object
ng event ng                             usage      configur  level  w level level
                                                   ed rule
             action                          ass   type
                                             ign
                                             to              d
                                             the             a
                                             bes             t
                                             t               o
                                             tea             r
                                             m               y
                                             or              F
                                             ass             i
                                             ign             e
                                             ee              l
                                             Ch              d
                                             eck             s
                                             the             r
                                             ma              u
                                             nd              l
                                             ato             e
                                             ry              M
                                             fiel            a
                                             ds              n
                                             an              d
                                             d               a
                                             var             t
                                             iabl            o
                                             es              r
                                             for             y
                                             log             V
                                             gin             a
                                             g               r
                                             Ch              i
                                             eck             a
                                             wh              b
                                             eth             l
                                             er              e
                                                             s
                                                             r


Triggeri Triggeri                       Typical    Typical   Phase  Workflo Object
ng event ng                             usage      configur  level  w level level
                                                   ed rule
             action                          the   type
                                             co
                                             mpl        u
                                             ete        l
                                             d          e
                                             fiel  Vali
                                             ds    dat
                                             are   ion
                                             vali  ch
                                             d     eck
                                                   :
                                                        V
                                                        a
                                                        l
                                                        i
                                                        d
                                                        a
                                                        t
                                                        e
                                                        D
                                                        a
                                                        t
                                                        e
                                                        r
                                                        u
                                                        l
                                                        e
                                                        V
                                                        a
                                                        l
                                                        i
                                                        d
                                                        a
                                                        t
                                                        e
                                                        T
                                                        e


Triggeri Triggeri                       Typical  Typical   Phase  Workflo Object
ng event ng                             usage    configur  level  w level level
                                                 ed rule
             action                              type

                                                           x
                                                           t
                                                           /
                                                           N
                                                           u
                                                           m
                                                           b
                                                           e
                                                           r
                                                           r
                                                           u
                                                           l
                                                           e
                                                           V
                                                           a
                                                           l
                                                           i
                                                           d
                                                           a
                                                           t
                                                           e
                                                           a
                                                           g
                                                           a
                                                           i
                                                           n
                                                           s
                                                           t
                                                           L
                                                           i
                                                           s
                                                           t
                                                           r
                                                           u


Triggeri Triggeri                       Typical  Typical      Phase  Workflo Object
ng event ng                             usage    configur     level  w level level
                                                 ed rule
             action                              type

                                                           l
                                                           e
                                                           V
                                                           a
                                                           l
                                                           i
                                                           d
                                                           a
                                                           t
                                                           e
                                                           a
                                                           g
                                                           a
                                                           i
                                                           n
                                                           s
                                                           t
                                                           T
                                                           a
                                                           b
                                                           l
                                                           e
                                                           r
                                                           u
                                                           l
                                                           e


Triggeri Triggeri                       Typical  Typical   Phase  Workflo Object
ng event ng                             usage    configur  level  w level level
                                                 ed rule
             action                              type

After  Runs                             Se       Se               Yes  Yes

success immedia                         nd       nd

ful add tely after                      em       HT

       the                              ail      ML

       record is                        to       Em

       added to                         not      ail

       the                              ify      rul

       databas                          rel      e

       e                                eva      Se

                                        nt       nd

                                        pe       Not

                                        opl      ific

                                        e        atio

                                        Se       ns

                                        nd       rul

                                        not      e

                                        ific     Sta

                                        atio     rt

                                        n        or

                                        to       Sto

                                        not      p

                                        ify      Clo

                                        op       ck

                                        era

                                        tor

                                        wit

                                        ha

                                        cus

                                        to

                                        miz

                                        ed

                                        me

                                        ssa

                                        ge


Triggeri Triggeri                       Typical   Typical   Phase  Workflo Object
ng event ng                             usage     configur  level  w level level
                                                  ed rule
             action                          Sta  type
                                             rt
                                             or
                                             sto
                                             p
                                             the
                                             ela
                                             pse
                                             d
                                             tim
                                             e
                                             of
                                             the
                                             rec
                                             ord


Triggeri Triggeri                       Typical  Typical      Phase  Workflo Object
ng event ng                             usage    configur     level  w level level
                                                 ed rule
             action                              type

On enter  Runs                          Ch       Ma           Yes    Yes  Yes
          when
          the                           eck      nd
          record
          tries to                      the      ato
          move
          from                          ma       ry
          another
          phase                         nd       ch
          into this
          phase                         ato      eck

                                        ry       :

                                        fiel               S

                                        ds                 e

                                        an                 t

                                        d                  M

                                        var                a

                                        iabl               n

                                        es                 d

                                        for                a

                                        Lo                 t

                                        ggi                o

                                        ng                 r

                                        Ch                 y

                                        eck                F

                                        wh                 i

                                        eth                e

                                        er                 l

                                        the                d

                                        co                 s

                                        mpl                r

                                        ete                u

                                        d                  l

                                        fiel               e

                                        ds                 M

                                        are                a

                                        vali               n

                                        d                  d

                                                           a


Triggeri Triggeri                       Typical    Typical   Phase  Workflo Object
ng event ng                             usage      configur  level  w level level
                                                   ed rule
             action                          Set   type
                                             def
                                             ault       t
                                             fiel       o
                                             d          r
                                             val        y
                                             ues        V
                                                        a
                                                        r
                                                        i
                                                        a
                                                        b
                                                        l
                                                        e
                                                        s
                                                        r
                                                        u
                                                        l
                                                        e
                                                   Vali
                                                   dat
                                                   ion
                                                   ch
                                                   eck
                                                   :
                                                        V
                                                        a
                                                        l
                                                        i
                                                        d
                                                        a
                                                        t
                                                        e
                                                        D
                                                        a
                                                        t
                                                        e


Triggeri Triggeri                       Typical  Typical   Phase  Workflo Object
ng event ng                             usage    configur  level  w level level
                                                 ed rule
             action                              type

                                                           r
                                                           u
                                                           l
                                                           e
                                                           V
                                                           a
                                                           l
                                                           i
                                                           d
                                                           a
                                                           t
                                                           e
                                                           T
                                                           e
                                                           x
                                                           t
                                                           /
                                                           N
                                                           u
                                                           m
                                                           b
                                                           e
                                                           r
                                                           r
                                                           u
                                                           l
                                                           e
                                                           V
                                                           a
                                                           l
                                                           i
                                                           d
                                                           a
                                                           t
                                                           e


Triggeri Triggeri                       Typical  Typical      Phase  Workflo Object
ng event ng                             usage    configur     level  w level level
                                                 ed rule
             action                              type

                                                           a
                                                           g
                                                           a
                                                           i
                                                           n
                                                           s
                                                           t
                                                           L
                                                           i
                                                           s
                                                           t
                                                           r
                                                           u
                                                           l
                                                           e
                                                           V
                                                           a
                                                           l
                                                           i
                                                           d
                                                           a
                                                           t
                                                           e
                                                           a
                                                           g
                                                           a
                                                           i
                                                           n
                                                           s
                                                           t
                                                           T
                                                           a
                                                           b
                                                           l
                                                           e


Triggeri Triggeri                       Typical  Typical   Phase  Workflo Object
ng event ng                             usage    configur  level  w level level
                                                 ed rule
             action                              type

                                                      r
                                                      u
                                                      l
                                                      e
                                                 Set
                                                 Fiel
                                                 d
                                                 rul
                                                 e


Triggeri Triggeri                       Typical  Typical   Phase  Workflo Object
ng event ng                             usage    configur  level  w level level
                                                 ed rule
             action                              type

After      Runs                         Se       Se        Yes    Yes  Yes
success    after the
ful enter  record                       nd       nd
           success
           fully                        em       HT
           moves
           from                         ail      ML
           another
           phase                        to       Em
           into this
           phase                        not      ail

                                        ify      rul

                                        rel      e

                                        eva      Se

                                        nt       nd

                                        pe       Not

                                        opl      ific

                                        e        atio

                                        Se       ns

                                        nd       rul

                                        not      e

                                        ific     Sta

                                        atio     rt

                                        n        or

                                        to       Sto

                                        not      p

                                        ify      Clo

                                        op       ck

                                        era      Ru

                                        tor      n

                                        wit      Sc

                                        h        he

                                        cus      dul

                                        to       ed

                                        miz      Act

                                        ed       ion

                                        me       Ru

                                        ssa      n

                                        ge


Triggeri Triggeri                       Typical    Typical   Phase  Workflo Object
ng event ng                             usage      configur  level  w level level
                                                   ed rule
             action                          Sta   type
                                             rt
                                             or         Act
                                             sto        ion
                                             p
                                             the
                                             ela
                                             pse
                                             d
                                             tim
                                             e
                                             for
                                             a
                                             situ
                                             atio
                                             n
                                             of
                                             the
                                             rec
                                             ord
                                             Sc
                                             he
                                             dul
                                             ed
                                             aut
                                             om
                                             atic
                                             acti
                                             ons
                                             ,
                                             for
                                             exa
                                             mpl
                                             e,
                                             aut


Triggeri Triggeri                       Typical    Typical   Phase  Workflo Object
ng event ng                             usage      configur  level  w level level
                                                   ed rule
             action                          om    type
                                             atic
                                             clo
                                             sur
                                             e
                                             Cro
                                             ss-
                                             mo
                                             dul
                                             e
                                             acti
                                             ons

On exit  Runs                                                Yes    Yes  Yes
         when
         the
         record
         tries to
         move
         out of
         this
         phase


Triggeri Triggeri                       Typical  Typical   Phase  Workflo Object
ng event ng                             usage    configur  level  w level level
                                                 ed rule
             action                              type

Initializat Runs                        Set      Set       Yes    Yes  Yes

ion  once                               the      Fiel

     just                               rec      d

     before                             ord      fro

     the                                ID       m

     record is                          if       Nu

     displaye                           not      mb

     d to the                           del      er

     user                               ayi      rul

                                        ng       e

                                        ass      Ru

                                        igni     n

                                        ng       Jav

                                        rec      aS

                                        ord      cri

                                        nu       pt

                                        mb       rul

                                        er       e

                                        Initi

                                        aliz

                                        e

                                        the

                                        list

                                        tha

                                        t

                                        the

                                        cur

                                        ren

                                        t

                                        ph

                                        ase

                                        use

                                        s


Triggeri Triggeri                       Typical  Typical   Phase  Workflo Object
ng event ng                             usage    configur  level  w level level
                                                 ed rule
             action                              type

On       Runs                           Initialize Run     Yes    Yes  Yes
display
         each                           the      JavaScri

         time the variable pt rule

         record is s that

         displaye are used

         d after a on the

         user                           display

         action form


Triggeri Triggeri                       Typical  Typical      Phase  Workflo Object
ng event ng                             usage    configur     level  w level level
                                                 ed rule
             action                              type

On  Runs                                Ch       Ma           Yes    Yes  Yes

update immedia                          eck      nd

    tely                                the      ato

    before                              ma       ry

    the                                 nd       ch

    record is                           ato      eck

    updated                             ry       :

    in the                              fiel               S

    databas                             ds                 e

    e                                   an                 t

                                        d                  M

                                        var                a

                                        iabl               n

                                        es                 d

                                        for                a

                                        log                t

                                        gin                o

                                        g                  r

                                        Ch                 y

                                        eck                F

                                        wh                 i

                                        eth                e

                                        er                 l

                                        the                d

                                        co                 s

                                        mpl                r

                                        ete                u

                                        d                  l

                                        fiel               e

                                        ds                 M

                                        are                a

                                        vali               n

                                        d                  d

                                                           a


Triggeri Triggeri                       Typical   Typical   Phase  Workflo Object
ng event ng                             usage     configur  level  w level level
                                                  ed rule
             action                          Wi   type
                                             zar
                                             d         t
                                             to        o
                                             sus       r
                                             pe        y
                                             nd        V
                                             or        a
                                             res       r
                                             um        i
                                             ea        a
                                             pro       b
                                             ces       l
                                             s         e
                                                       s
                                                       r
                                                       u
                                                       l
                                                       e
                                                  Vali
                                                  dat
                                                  ion
                                                  ch
                                                  eck
                                                  :
                                                       V
                                                       a
                                                       l
                                                       i
                                                       d
                                                       a
                                                       t
                                                       e
                                                       D
                                                       a
                                                       t
                                                       e


Triggeri Triggeri                       Typical  Typical   Phase  Workflo Object
ng event ng                             usage    configur  level  w level level
                                                 ed rule
             action                              type

                                                           r
                                                           u
                                                           l
                                                           e
                                                           V
                                                           a
                                                           l
                                                           i
                                                           d
                                                           a
                                                           t
                                                           e
                                                           T
                                                           e
                                                           x
                                                           t
                                                           /
                                                           N
                                                           u
                                                           m
                                                           b
                                                           e
                                                           r
                                                           r
                                                           u
                                                           l
                                                           e
                                                           V
                                                           a
                                                           l
                                                           i
                                                           d
                                                           a
                                                           t
                                                           e


Triggeri Triggeri                       Typical  Typical      Phase  Workflo Object
ng event ng                             usage    configur     level  w level level
                                                 ed rule
             action                              type

                                                           a
                                                           g
                                                           a
                                                           i
                                                           n
                                                           s
                                                           t
                                                           L
                                                           i
                                                           s
                                                           t
                                                           r
                                                           u
                                                           l
                                                           e
                                                           V
                                                           a
                                                           l
                                                           i
                                                           d
                                                           a
                                                           t
                                                           e
                                                           a
                                                           g
                                                           a
                                                           i
                                                           n
                                                           s
                                                           t
                                                           T
                                                           a
                                                           b
                                                           l
                                                           e


Triggeri Triggeri                       Typical  Typical   Phase  Workflo Object
ng event ng                             usage    configur  level  w level level
                                                 ed rule
             action                              type

                                                      r
                                                      u
                                                      l
                                                      e
                                                 Ru
                                                 na
                                                 Wi
                                                 zar
                                                 d


Triggeri Triggeri                       Typical  Typical   Phase  Workflo Object
ng event ng                             usage    configur  level  w level level
                                                 ed rule
             action                              type

After  Runs                             Se       Se        Yes    Yes  Yes

success immedia                         nd       nd

ful    tely after                       em       HT

update the                              ail      ML

       record is                        to       Em

       updated                          not      ail

       success                          ify      rul

       fully in                         rel      e

       the                              eva      Se

       databas                          nt       nd

       e                                pe       Not

                                        opl      ific

                                        e        atio

                                        Se       ns

                                        nd       rul

                                        not      e

                                        ific     Sta

                                        atio     rt

                                        n        or

                                        to       Sto

                                        not      p

                                        ify      Clo

                                        op       ck

                                        era      Ru

                                        tor      n

                                        wit      Sc

                                        h        he

                                        cus      dul

                                        to       ed

                                        miz      Act

                                        ed       ion

                                        me       Ru

                                        ssa      n

                                        ge


Triggeri Triggeri                       Typical    Typical   Phase  Workflo Object
ng event ng                             usage      configur  level  w level level
                                                   ed rule
             action                          Sta   type
                                             rt
                                             or         Act
                                             sto        ion
                                             p
                                             the
                                             ela
                                             pse
                                             d
                                             tim
                                             e
                                             of
                                             the
                                             rec
                                             ord
                                             Sc
                                             he
                                             dul
                                             ed
                                             aut
                                             om
                                             atic
                                             acti
                                             ons
                                             ,
                                             for
                                             exa
                                             mpl
                                             e,
                                             aut
                                             om
                                             atic
                                             clo
                                             sur
                                             e


Triggeri Triggeri                       Typical    Typical   Phase  Workflo Object
ng event ng                             usage      configur  level  w level level
                                                   ed rule
             action                          Cro   type
                                             ss-
                                             mo
                                             dul
                                             e
                                             acti
                                             ons


Triggeri Triggeri                       Typical  Typical      Phase  Workflo Object
ng event ng                             usage    configur     level  w level level
                                                 ed rule
             action                              type

Rule  Runs                              Ch       Ma

sets on when                            eck      nd

Transitio the                           the      ato

ns    transitio                         ma       ry

      n occurs                          nd       ch

                                        ato      eck

                                        ry       :

                                        fiel               S

                                        ds                 e

                                        an                 t

                                        d                  M

                                        var                a

                                        iabl               n

                                        es                 d

                                        for                a

                                        log                t

                                        gin                o

                                        g                  r

                                        Ch                 y

                                        eck                F

                                        wh                 i

                                        eth                e

                                        er                 l

                                        the                d

                                        co                 s

                                        mpl                r

                                        ete                u

                                        d                  l

                                        fiel               e

                                        ds                 M

                                        are                a

                                        vali               n

                                        d                  d

                                                           a


Triggeri Triggeri                       Typical    Typical   Phase  Workflo Object
ng event ng                             usage      configur  level  w level level
                                                   ed rule
             action                          Wi    type
                                             zar
                                             d          t
                                             to         o
                                             clo        r
                                             se         y
                                             or         V
                                             can        a
                                             cel        r
                                             the        i
                                             pro        a
                                             ces        b
                                             s          l
                                             for        e
                                             ma         s
                                             nu         r
                                             al         u
                                             tra        l
                                             nsit       e
                                             ion   Vali
                                                   dat
                                                   ion
                                                   ch
                                                   eck
                                                   :
                                                        V
                                                        a
                                                        l
                                                        i
                                                        d
                                                        a
                                                        t
                                                        e
                                                        D
                                                        a
                                                        t
                                                        e


Triggeri Triggeri                       Typical  Typical   Phase  Workflo Object
ng event ng                             usage    configur  level  w level level
                                                 ed rule
             action                              type

                                                           r
                                                           u
                                                           l
                                                           e
                                                           V
                                                           a
                                                           l
                                                           i
                                                           d
                                                           a
                                                           t
                                                           e
                                                           T
                                                           e
                                                           x
                                                           t
                                                           /
                                                           N
                                                           u
                                                           m
                                                           b
                                                           e
                                                           r
                                                           r
                                                           u
                                                           l
                                                           e
                                                           V
                                                           a
                                                           l
                                                           i
                                                           d
                                                           a
                                                           t
                                                           e


Triggeri Triggeri                       Typical  Typical      Phase  Workflo Object
ng event ng                             usage    configur     level  w level level
                                                 ed rule
             action                              type

                                                           a
                                                           g
                                                           a
                                                           i
                                                           n
                                                           s
                                                           t
                                                           L
                                                           i
                                                           s
                                                           t
                                                           r
                                                           u
                                                           l
                                                           e
                                                           V
                                                           a
                                                           l
                                                           i
                                                           d
                                                           a
                                                           t
                                                           e
                                                           a
                                                           g
                                                           a
                                                           i
                                                           n
                                                           s
                                                           t
                                                           T
                                                           a
                                                           b
                                                           l
                                                           e


Triggeri Triggeri                       Typical  Typical   Phase  Workflo Object
ng event ng                             usage    configur  level  w level level
                                                 ed rule
             action                              type

                                                      r
                                                      u
                                                      l
                                                      e
                                                 Ru
                                                 na
                                                 Wi
                                                 zar
                                                 d

For more information, see Consider rule set execution order.


1.7.5.8.3. Configure actions at various
levels

Actions can be applied to individual phases.
In certain circumstances, you may want to define actions at the workflow level. For
example, in cases where a certain button needed to be present in each phase of a
workflow. In other cases, you may want to define actions at the object level (for
example, if a certain button needs to be present in each phase of all workflows).
````
